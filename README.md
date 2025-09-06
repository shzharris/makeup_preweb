## 项目概述（Vercel + Next.js + Supabase + Google 登录）

一个基于 Next.js 的 AI 妆容分析与处理平台，部署于 Vercel：
- **流程**：Google 登录 -> 订阅校验 -> 上传/拍照 -> 记录上传日志并生成图片ID -> 调用 Google GenAI 模型 -> 展示处理结果 -> 后端记录消费 -> 公开/私密图库。
- **关键点**：
  - 仅启用 Google 登录（NextAuth.js）。
  - 订阅校验（Stripe），未订阅/过期跳转价格页。
  - 模型处理期间显示“处理中”。
  - 模型前置日志：生成图片ID并记录上传原图。
  - 图片统一存放 GCS，前后端使用签名 URL 访问。
  - 上传支持“是否公开”，用于图片广场展示。

## 技术选型与建议

- **前后端框架**：Next.js 14+（App Router，Route Handlers）
- **数据库与鉴权**：Supabase（Postgres + Supabase Auth + RLS）
  - 结论：可用且推荐。优点是接入成本低、Postgres 能满足结构化数据、Supabase Auth 与 Next.js 集成成熟。
- **支付与订阅**：Stripe（Checkout + Customer Portal + Webhooks）
- **身份认证**：
  - 当前阶段：仅启用 Google 登录（NextAuth.js）。
  - 后续可选：Apple、邮箱（Magic Link/密码）。
  - 回调：Next.js Route Handlers 实现登录回调、会话同步与订阅状态预取。
- **AI 模型（Google）**：
  - 分析/生成：Google GenAI (Gemini API) 模型 `gemini-2.5-flash-image-preview`，支持 IMAGE + TEXT 流式输出；通过 `@google/genai` SDK 调用，使用 `GEMINI_API_KEY`。
  - 备选：若需完全在 GCP 内网、或需更深集成，可切换 Vertex AI 对应模型；能力与成本需单独评估。
- **对象存储（第三方存储桶）**：Google Cloud Storage（GCS）。建议与推理所在区域一致；签名 URL 简单，适合大图；可结合 Cloud CDN。
- **异步与任务队列**：
  - 本地/最简：API 内同步调用（仅开发调试）。
  - 生产推荐：队列 + Worker
    - 方案A（全托管）：Vercel Queues + Route Handler Worker
    - 方案B（GCP 原生）：Cloud Tasks + Cloud Run Worker

## 架构与数据流

1) 用户点击上传
- 前端调用`GET /api/subscription/status`校验订阅；未订阅或过期 -> 跳转价格页。
- 通过`POST /api/uploads/init`创建上传任务，生成`image_id`与原图上传签名 URL（或直传策略）。

2) 上传原图
- 前端直传至 GCS（签名 URL；减少后端带宽开销）。
- 成功后`POST /api/analyze`携带`image_id`、公开选项、原图URL，进入异步处理队列。
- 前端进入“处理中”状态，轮询`GET /api/jobs/:id`或通过 SSE 订阅状态。

3) 后端处理
- 记录“模型开始”日志，调用 Google GenAI（`gemini-2.5-flash-image-preview`，流式返回文本/图片）。
- 将处理后图片上传 GCS，保存 URL。
- 写入消费记录与分析结果；若公开则标记可被图片广场查询。

4) 前端展示
- 处理完成后返回：处理后图片URL + 结构化分析JSON；页面更新并持久化到用户中心。

## 关键页面

- 订阅价格页：Stripe Checkout 嵌入，状态回传并存 DB。
- 上传/拍照页：文件上传、摄像头（`getUserMedia`）、公开开关、进度状态。
- 结果页：原图/处理后图对比、分析 JSON 可视化。
- 用户中心：消费记录、历史图片、订阅状态。
- 图片广场：仅展示用户选择公开的图片，支持分页与基础审核过滤。
- 登录/回调：登录入口、邮箱注册/登录、第三方同意页回跳。

## 数据模型（Supabase Postgres）

```sql
-- users 使用 supabase.auth.users 作为主用户源

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'stripe',
  status text not null, -- active | past_due | canceled | trialing | incomplete
  current_period_end timestamptz,
  price_id text,
  customer_id text,
  created_at timestamptz default now()
);

create table public.images (
  id uuid primary key, -- 由后端生成的 image_id
  user_id uuid not null references auth.users(id) on delete cascade,
  is_public boolean not null default false,
  original_url text not null,
  processed_url text,
  status text not null default 'pending', -- pending | processing | completed | failed
  failure_reason text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.images(id) on delete cascade,
  model_version text,
  result_json jsonb not null,
  created_at timestamptz default now()
);

create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_id uuid references public.images(id) on delete set null,
  action text not null, -- upload_init | model_start | model_success | model_fail | view
  meta jsonb,
  created_at timestamptz default now()
);
```

RLS 建议（节选）：
- `images`：仅允许图片所属用户读取/写入；额外开放`is_public = true`的只读查询（用于图片广场）。
- `analysis_results`：仅允许图片所属用户读取。

## API 设计（Route Handlers）

- `GET /api/subscription/status`
  - 返回订阅状态与过期时间。

- `POST /api/uploads/init`
  - 输入：`{ isPublic: boolean }`
  - 生成`image_id`，记录日志`upload_init`，创建 GCS 签名上传URL与目标路径，写入`images`为`pending`。
  - 输出：`{ imageId, uploadUrl, uploadFields?, bucketPath }`

- `POST /api/analyze`
  - 输入：`{ imageId, originalUrl, isPublic }`
  - 更新`images.is_public`、`original_url`，推入队列并返回`jobId`。

- `GET /api/jobs/:id`
  - 返回作业状态与（若完成）处理后图片URL与分析 JSON。

- `POST /api/stripe/webhook`
  - 同步订阅状态、价格、当前周期等信息。

- `GET /api/auth/callback/*`
  - 处理 Google/Apple 回调与邮箱 Magic Link 验证；完成后重定向到用户中心或原始回跳地址。

## 处理流程（后端 Worker）

1) 拉取作业，设置`images.status = processing`，写`usage_logs(model_start)`。
2) 调用 Google GenAI：
   - 使用 `@google/genai`，模型 `gemini-2.5-flash-image-preview`，`responseModalities: ['IMAGE','TEXT']`，流式处理。
   - 若 `chunk.candidates[0].content.parts[0].inlineData` 存在，提取 Base64 并写入 GCS 作为处理后图片；否则根据返回文本作为分析说明。
   - 需要结构化 JSON 时，用提示约束模型仅输出 JSON，并在后端校验解析。
3) 上传处理后图片至 GCS，得到`processed_url`。
4) 写入`analysis_results`与`images.processed_url/completed_at/status=completed`，记录`usage_logs(model_success)`。
5) 异常则记录失败原因并`status=failed`，记录`usage_logs(model_fail)`。

## 前端交互要点

- 订阅校验：无权限即跳转价格页。
- 上传：优先直传至 GCS（签名URL）；移动端启用摄像头（需 HTTPS 与用户授权）。
- 处理中：Skeleton/Spinner + 作业状态轮询或 SSE。
- 结果展示：原/处理对比 + 可视化解析（标签、热力、建议列表）。
- 公开选项：上传前切换；仅`is_public = true`的资源进入图片广场。

## 存储桶与路径规划（GCS 示例）

- Bucket：`gs://ai-makeup-prod`（dev/stage/prod 分环境）
- 目录：
  - 原图：`original/{user_id}/{image_id}.jpg`
  - 处理：`processed/{user_id}/{image_id}.jpg`
- 访问：服务端生成签名 URL（上传/下载），公开图片可配置 Cloud CDN + 公网可读策略（谨慎）。

## 环境变量示例（Vercel Project Settings）

```bash
# Supabase（Postgres）
DATABASE_URL=postgres://...  # 建议使用 Supabase Pooler（端口 6543，require SSL）

# Google Cloud（服务端读取 JSON 而非文件路径）
GCS_BUCKET=ai-makeup-dev
GOOGLE_CREDENTIALS={...json...}  # 服务账号 JSON 内容（整段）

# Stripe（订阅）
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# Auth（NextAuth.js：仅 Google）
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 安全与隐私

- 明确告知：仅在用户选择公开时才会出现在图片广场。
- 非公开图片通过签名 URL 访问；DB 受 RLS 保护。
- 保存最小必要信息；日志不保存人脸可识别元数据（除必要的处理指标）。
- 数据保留与删除：用户中心支持删除原图与处理图，并在 GCS 清理。

## 开发与运行

```bash
pnpm i
pnpm dev
```

本地开发时：
- 使用 `@google-cloud/storage` 或直接调用 GCS JSON 凭证初始化客户端。
- 模型：使用 `@google/genai`（Gemini API）。示例：

```ts
// 依赖：npm i @google/genai mime && npm i -D @types/node
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';

type StreamChunk = {
  candidates?: Array<{
    content?: { parts?: Array<any> }
  }>
  text?: string
}

export async function runGeminiDemo(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const config = { responseModalities: ['IMAGE', 'TEXT'] } as const;
  const model = 'gemini-2.5-flash-image-preview';
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];

  const response = await ai.models.generateContentStream({ model, config, contents });
  const images: Array<{ buffer: Buffer; mimeType: string }> = [];
  let texts: string[] = [];

  for await (const chunk of response as any as AsyncIterable<StreamChunk>) {
    const parts = chunk?.candidates?.[0]?.content?.parts ?? [];
    const first = parts[0];
    if (first?.inlineData) {
      const mimeType = first.inlineData.mimeType || 'image/png';
      const buf = Buffer.from(first.inlineData.data || '', 'base64');
      images.push({ buffer: buf, mimeType });
    } else if (chunk?.text) {
      texts.push(chunk.text);
    }
  }

  return { images, text: texts.join('') };
}
```

> 生产中将生成的二进制图片写入 GCS 并获取签名访问 URL，而不是写入本地文件系统。

### 在 Vercel 读取 GCS 凭证并上传

```ts
// lib/gcs.ts
import { Storage } from '@google-cloud/storage';

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
const storage = new Storage({ credentials });
const bucket = storage.bucket(process.env.GCS_BUCKET!);

export async function uploadBufferToGCS(path: string, buffer: Buffer, contentType = 'image/png') {
  const file = bucket.file(path);
  await file.save(buffer, { contentType, resumable: false, public: false });
  // 生成有时效的签名 URL（下载）
  const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000 * 60 * 60 });
  return { url, path };
}
```

## 部署建议

- Next.js：Vercel 或 Cloud Run（SSR 路由）
- 队列与 Worker：
  - Vercel Queues + Route Handlers（最少运维）
  - 或 Cloud Tasks + Cloud Run（更强控制）
- GCS 与推理区域保持一致，降低延迟与流量。

## Vercel 上线步骤（只含 Google 登录）

1) Git 仓库推送并在 Vercel 导入项目。
2) 配置上文“环境变量示例”。
3) 在 Google Cloud Console 创建 OAuth 凭据：
   - 授权重定向 URI（生产）：`https://<your-domain>/api/auth/callback/google`
   - 本地开发：`http://localhost:3000/api/auth/callback/google`
4) 设置 NEXTAUTH_URL 为生产域名；触发部署。
5) 打开站点验证：Google 登录 -> 上传 -> 处理中 -> 查看结果。

## API 返回示例

```json
// GET /api/subscription/status
{
  "status": "active",
  "currentPeriodEnd": "2025-12-01T00:00:00Z"
}
```

```json
// POST /api/uploads/init -> 200
{
  "imageId": "7f0b8b4e-...",
  "uploadUrl": "https://storage.googleapis.com/...",
  "bucketPath": "original/{user}/{image}.jpg"
}
```

```json
// GET /api/jobs/:id -> completed
{
  "status": "completed",
  "processedUrl": "https://storage.googleapis.com/.../processed/{user}/{image}.jpg",
  "analysis": {
    "skin": { "acne": "mild", "oil": "medium" },
    "makeup": [{ "area": "lip", "issue": "smudge", "confidence": 0.86 }],
    "suggestions": ["补涂口红边界", "使用控油妆前乳"]
  }
}
```

## 订阅与消费记录

- 订阅：Stripe Webhook 更新 `subscriptions` 表状态。
- 消费记录：每次分析写入 `usage_logs`（image_id 关联），用户中心按时间线展示。

## 风险与备选方案

- Vertex AI 图像编辑权限受限：退化为仅分析 + 叠加标注生成“处理后图”。
- 队列缺失：短期可同步调用，但存在超时与扩展性风险。
- 跨云带宽：若使用 Supabase Storage 与 Vertex AI 组合，需评估成本；推荐统一到 GCP。

## 里程碑

1) MVP：订阅校验、上传直传、异步分析、结果展示、用户中心、公开图库。
2) 优化：图像编辑增强、内容审核、国际化、批量处理、社交分享。

## 身份认证与回调（Google 单提供商）

### NextAuth.js（仅启用 Google）
- Provider：Google（OAuth 2.0 Web）
- 会话：JWT（默认）
- 回调：`/api/auth/callback/google` 自动处理；可在 `callbacks` 中扩展订阅态注入

### 路由结构（最小可用示例）

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
```


