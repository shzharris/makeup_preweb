import { Pool } from "pg";
import { randomUUID } from "crypto";

const isProduction = process.env.NODE_ENV === "production";

// Reuse pool across serverless invocations to avoid exhausting connections
const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const pool: Pool =
  globalForDb.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });

if (!globalForDb.pgPool) globalForDb.pgPool = pool;

// Safe log for debugging: show only host and port if possible
try {
  const url = new URL(process.env.DATABASE_URL || "");
  // eslint-disable-next-line no-console
  console.log("[DB Init] host:", url.hostname, "port:", url.port || (isProduction ? "5432/6543?" : "5432"));
} catch {}

export type UpsertMakeupUserParams = {
  loginEmail: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  loginType: string;
  oauthProvider?: string | null;
  oauthSub?: string | null;
};

export async function upsertMakeupUser(params: UpsertMakeupUserParams): Promise<string> {
  const { loginEmail, nickname, avatarUrl, loginType, oauthProvider, oauthSub } = params;
  const client = await pool.connect();
  try {
    const email = (loginEmail ?? "").trim().toLowerCase();
    const id = randomUUID();
    let res;
    if (oauthProvider && oauthSub) {
      // Prefer provider+sub as stable identifier
      res = await client.query(
        `
        INSERT INTO public.makeup_user (id, created_at, nickname, avatar_url, login_email, login_type, oauth_provider, oauth_sub)
        VALUES ($1, NOW(), $2, $3, NULLIF($4, ''), $5, $6, $7)
        ON CONFLICT (oauth_provider, oauth_sub)
        DO UPDATE SET
          nickname = EXCLUDED.nickname,
          avatar_url = EXCLUDED.avatar_url,
          login_email = COALESCE(EXCLUDED.login_email, public.makeup_user.login_email),
          login_type = EXCLUDED.login_type
        RETURNING id
        `,
        [id, nickname ?? "", avatarUrl ?? "", email, loginType, oauthProvider, oauthSub]
      );
    } else {
      if (!email) throw new Error("Missing identifier for upsertMakeupUser (need email or provider+sub)");
      res = await client.query(
        `
        INSERT INTO public.makeup_user (id, created_at, nickname, avatar_url, login_email, login_type)
        VALUES ($1, NOW(), $2, $3, $4, $5)
        ON CONFLICT (login_email)
        DO UPDATE SET
          nickname = EXCLUDED.nickname,
          avatar_url = EXCLUDED.avatar_url,
          login_type = EXCLUDED.login_type
        RETURNING id
        `,
        [id, nickname ?? "", avatarUrl ?? "", email, loginType]
      );
    }
    return res.rows[0].id as string;
  } finally {
    client.release();
  }
}

export async function getMakeupUserIdByEmail(loginEmail: string): Promise<string | null> {
  const client = await pool.connect();
  try {
    const email = (loginEmail ?? "").trim().toLowerCase();
    if (!email) return null;
    const res = await client.query(
      `SELECT id FROM public.makeup_user WHERE login_email = $1 LIMIT 1`,
      [email]
    );
    return res.rows[0]?.id ?? null;
  } finally {
    client.release();
  }
}

export async function insertUsageLog(params: {
  makeupUserId: string;
  action: string;
  actionDataId: string;
}): Promise<void> {
  const { makeupUserId, action, actionDataId } = params;
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO public.makeup_usage_log (makeup_user_id, action, action_data_id)
       VALUES ($1, $2, $3)`,
      [makeupUserId, action, actionDataId]
    );
  } finally {
    client.release();
  }
}

export async function getMakeupUserIdByProviderSub(oauthProvider: string, oauthSub: string): Promise<string | null> {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT id FROM public.makeup_user WHERE oauth_provider = $1 AND oauth_sub = $2 LIMIT 1`,
      [oauthProvider, oauthSub]
    );
    return res.rows[0]?.id ?? null;
  } finally {
    client.release();
  }
}

// -----------------------------
// Makeup User Photo queries
// -----------------------------

export type MakeupUserPhoto = {
  id: string;
  created_at: string;
  makeup_user_id: string | null;
  is_public: number | null;
  original_url: string;
  processed_url: string | null;
  status: string | null;
  failure_reason: string | null;
  completed_at: string | null;
};

export async function listMakeupUserPhotos(params: {
  makeupUserId: string;
  limit?: number;
  offset?: number;
}): Promise<MakeupUserPhoto[]> {
  const { makeupUserId, limit = 24, offset = 0 } = params;
  const client = await pool.connect();
  try {
    const res = await client.query(
      `
      SELECT id, created_at, makeup_user_id, is_public, original_url, processed_url, status, failure_reason, completed_at
      FROM public.makeup_user_photo
      WHERE makeup_user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [makeupUserId, limit, offset]
    );
    return res.rows as MakeupUserPhoto[];
  } finally {
    client.release();
  }
}

export async function listPublicMakeupPhotos(params?: {
  limit?: number;
  offset?: number;
}): Promise<MakeupUserPhoto[]> {
  const limit = params?.limit ?? 24;
  const offset = params?.offset ?? 0;
  const client = await pool.connect();
  try {
    const res = await client.query(
      `
      SELECT id, created_at, makeup_user_id, is_public, original_url, processed_url, status, failure_reason, completed_at
      FROM public.makeup_user_photo
      WHERE is_public = 1
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );
    return res.rows as MakeupUserPhoto[];
  } finally {
    client.release();
  }
}

export async function insertMakeupUserPhoto(params: {
  makeupUserId: string;
  isPublic: boolean;
  originalUrl: string;
}): Promise<string> {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO public.makeup_user_photo (makeup_user_id, is_public, original_url, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id`,
      [params.makeupUserId, params.isPublic ? 1 : 0, params.originalUrl]
    );
    return res.rows[0].id as string;
  } finally {
    client.release();
  }
}

export async function getPhotoById(photoId: string): Promise<MakeupUserPhoto | null> {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT id, created_at, makeup_user_id, is_public, original_url, processed_url, status, failure_reason, completed_at
       FROM public.makeup_user_photo
       WHERE id = $1
       LIMIT 1`,
      [photoId]
    );
    return (res.rows[0] as MakeupUserPhoto) ?? null;
  } finally {
    client.release();
  }
}

export async function updatePhotoProcessing(photoId: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE public.makeup_user_photo SET status = 'processing' WHERE id = $1`,
      [photoId]
    );
  } finally {
    client.release();
  }
}

export async function updatePhotoProcessed(photoId: string, processedUrl: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE public.makeup_user_photo
       SET processed_url = $2, status = 'completed', completed_at = NOW()
       WHERE id = $1`,
      [photoId, processedUrl]
    );
  } finally {
    client.release();
  }
}

export async function updatePhotoFailed(photoId: string, reason: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE public.makeup_user_photo
       SET status = 'failed', failure_reason = $2
       WHERE id = $1`,
      [photoId, reason.slice(0, 500)]
    );
  } finally {
    client.release();
  }
}

// -----------------------------
// Subscriptions
// -----------------------------

export type MakeupUserSubscription = {
  id: string;
  created_at: string;
  makeup_user_id: string | null;
  subscriptions_type: string | null; // '1' | '2' | '3'
  price: number | null;
  start_time: string | null; // stored as time without time zone
  end_time: string | null;   // stored as time without time zone
  start_at?: string | null; // timestamptz
  end_at?: string | null;   // timestamptz
  is_cacelled: number | null; // 0/1
  is_settlement: number | null; // 0/1
  pay_result?: string | null;
};

export async function getLatestSubscriptionByUserId(makeupUserId: string): Promise<MakeupUserSubscription | null> {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT id, created_at, makeup_user_id, subscriptions_type, price, start_time, end_time, is_cacelled, is_settlement, pay_result, start_at, end_at
       FROM public.makeup_user_subscriptions
       WHERE makeup_user_id = $1 and is_cacelled = 0 and pay_result = 'paid'
       ORDER BY created_at DESC
       LIMIT 1`,
      [makeupUserId]
    );
    return (res.rows[0] as MakeupUserSubscription) ?? null;
  } finally {
    client.release();
  }
}

export async function settleOneTimeSubscription(makeupUserId: string): Promise<string | null> {
  const client = await pool.connect();
  try {
    // 找到用户最近的一次性订阅（未结算、未取消）
    const sel = await client.query(
      `SELECT id FROM public.makeup_user_subscriptions
       WHERE makeup_user_id = $1 AND subscriptions_type = '1' and pay_result = 'paid' AND COALESCE(is_settlement,0) = 0 AND COALESCE(is_cacelled,0) = 0
       ORDER BY created_at DESC
       LIMIT 1`,
      [makeupUserId]
    );
    const id = sel.rows[0]?.id as string | undefined;
    if (!id) return null;
    await client.query(
      `UPDATE public.makeup_user_subscriptions SET is_settlement = 1 WHERE id = $1`,
      [id]
    );
    return id;
  } finally {
    client.release();
  }
}

export async function insertSubscriptionRecord(params: {
  makeupUserId: string;
  subscriptionsType: '1' | '2' | '3';
  price: number;
  payResult: 'unpaid' | 'paid' | 'faild';
  startTime?: string | null; // 'HH:MM:SS'
  endTime?: string | null;   // 'HH:MM:SS'
  startAt?: string | null;   // timestamptz ISO
  endAt?: string | null;     // timestamptz ISO
}): Promise<string> {
  const { makeupUserId, subscriptionsType, price, payResult, startTime, endTime, startAt, endAt } = params;
  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO public.makeup_user_subscriptions
         (makeup_user_id, subscriptions_type, price, start_time, end_time, start_at, end_at, is_cacelled, is_settlement, pay_result)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, $8)
       RETURNING id`,
      [makeupUserId, subscriptionsType, price, startTime ?? null, endTime ?? null, startAt ?? null, endAt ?? null, payResult]
    );
    return res.rows[0].id as string;
  } finally {
    client.release();
  }
}


