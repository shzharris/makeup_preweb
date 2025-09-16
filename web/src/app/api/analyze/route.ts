import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { updatePhotoProcessing, updatePhotoProcessed, updatePhotoFailed, getPhotoById, insertUsageLog } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

export const runtime = "nodejs";

// 提示词（可按需修改）。目标：轻度美化、提亮、磨皮、提高清晰度并保持自然妆效。
export const ENHANCE_PROMPT = `
You are a professional makeup retouching assistant.
Please analyze the photos of my makeup look today. If you see any areas for improvement, please mark them in red and indicate how you can improve them. If my makeup look is perfect, please mark it "Perfect" in red. Thank you.
Output only 1 image.
`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { photoId, originalUrl, contentType } = body as { photoId: string; originalUrl: string; contentType?: string };
  if (!photoId || !originalUrl) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // 获取所属用户用于日志
  const photo = await getPhotoById(photoId).catch(() => null);
  const makeupUserId = photo?.makeup_user_id || null;

  try {
    await updatePhotoProcessing(photoId);

    // 1) 下载原图转 base64
    const resp = await fetch(originalUrl);
    const ab = await resp.arrayBuffer();
    const mime = contentType || "image/png";
    const base64 = Buffer.from(ab).toString("base64");

    // 2) 调用 Gemini 生成（流式收集图片输出）
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const model = "gemini-2.5-flash-image-preview";
    const config = { responseModalities: ["IMAGE", "TEXT"] as string[] };
    const contents = [
      { role: "user", parts: [{ text: ENHANCE_PROMPT }, { inlineData: { data: base64, mimeType: mime } }] },
    ];

    const stream = (await ai.models.generateContentStream({ model, config, contents })) as unknown as AsyncIterable<{
      candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> } }>;
      text?: string;
    }>;

    let outImageB64: string | null = null;
    let outMime: string = "image/png";
    let textOut = "";
    for await (const chunk of stream) {
      const parts = chunk?.candidates?.[0]?.content?.parts ?? [];
      const first = parts[0];
      if (first?.inlineData?.data) {
        outImageB64 = first.inlineData.data;
        if (first.inlineData.mimeType) outMime = first.inlineData.mimeType;
        break;
      }
      if (chunk?.text) {
        textOut += chunk.text;
      }
    }

    if (!outImageB64) throw new Error("Model did not return image data");
    const outBuffer = Buffer.from(outImageB64, "base64");

    // 3) 生成 R2 预签名（query 模式），上传 processed 图
    const accountId = process.env.R2_ACCOUNT_ID as string;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID as string;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY as string;
    const bucket = process.env.R2_BUCKET as string;
    const endpoint = process.env.R2_ENDPOINT as string; // https://<account>.r2.cloudflarestorage.com
    const publicBase = process.env.R2_PUBLIC_BASE_URL as string | undefined;
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !endpoint) {
      throw new Error("R2 env missing");
    }

    const host = new URL(endpoint).host;
    const method = "PUT";
    const now2 = new Date();
    const amzDate2 = now2.toISOString().replace(/[:-]/g, "").replace(/\.\d{3}/, "");
    const datestamp2 = amzDate2.slice(0, 8);
    const region = "auto";
    const service = "s3";
    const ext = (outMime && outMime.includes("/")) ? (outMime.split("/")[1] || "png") : "png";
    const key = `processed/${photoId}.${ext}`;
    const canonicalUri2 = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
    const signedHeaders2 = "host";
    const payloadHash2 = "UNSIGNED-PAYLOAD";
    const credentialScope2 = `${datestamp2}/${region}/${service}/aws4_request`;
    const credential2 = `${accessKeyId}/${credentialScope2}`;
    const qp2: Record<string, string> = {
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": credential2,
      "X-Amz-Date": amzDate2,
      "X-Amz-Expires": String(600),
      "X-Amz-SignedHeaders": signedHeaders2,
    };
    const canonicalQuery2 = Object.keys(qp2)
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(qp2[k])}`)
      .join("&");
    const canonicalHeaders2 = `host:${host}\n`;
    const canonicalRequest2 = [method, canonicalUri2, canonicalQuery2, canonicalHeaders2, signedHeaders2, payloadHash2].join("\n");
    const stringToSign2 = [
      "AWS4-HMAC-SHA256",
      amzDate2,
      credentialScope2,
      crypto.createHash("sha256").update(canonicalRequest2).digest("hex"),
    ].join("\n");
    function hmac(key: crypto.BinaryLike | crypto.KeyObject, data: string) {
      return crypto.createHmac("sha256", key).update(data).digest();
    }
    const kDate = hmac("AWS4" + secretAccessKey, datestamp2);
    const kRegion = hmac(kDate, region);
    const kService = hmac(kRegion, service);
    const kSigning = hmac(kService, "aws4_request");
    const signature2 = crypto.createHmac("sha256", kSigning).update(stringToSign2).digest("hex");
    const uploadUrl2 = `${endpoint}${canonicalUri2}?${canonicalQuery2}&X-Amz-Signature=${signature2}`;

    const put2 = await fetch(uploadUrl2, { method: "PUT", headers: { "Content-Type": outMime }, body: outBuffer });
    if (!put2.ok) throw new Error(`Upload processed failed ${put2.status}`);

    const processedUrl = publicBase ? `${publicBase}/${key}` : `${endpoint}/${bucket}/${key}`;

    await updatePhotoProcessed(photoId, processedUrl);
    if (makeupUserId) {
      if (textOut) {
        await insertUsageLog({ makeupUserId, action: "model_text", actionDataId: textOut.slice(0, 1000) });
      }
      await insertUsageLog({ makeupUserId, action: "model_success", actionDataId: photoId });
    }
    return NextResponse.json({ ok: true, processedUrl });
  } catch (err) {
    await updatePhotoFailed(photoId, String(err));
    if (makeupUserId) {
      await insertUsageLog({ makeupUserId, action: "model_fail", actionDataId: String(err).slice(0, 500) });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}


