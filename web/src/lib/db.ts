import { Pool } from "pg";
import { randomUUID } from "crypto";

const isProduction = process.env.NODE_ENV === "production";

// Reuse pool across serverless invocations to avoid exhausting connections
const globalForDb = globalThis as unknown as { pgPool?: any };

export const pool =
  globalForDb.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });

if (!globalForDb.pgPool) globalForDb.pgPool = pool;

export type UpsertMakeupUserParams = {
  loginEmail: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  loginType: string;
};

export async function upsertMakeupUser(params: UpsertMakeupUserParams): Promise<string> {
  const { loginEmail, nickname, avatarUrl, loginType } = params;
  const client = await pool.connect();
  try {
    const email = (loginEmail ?? "").trim().toLowerCase();
    if (!email) throw new Error("Missing loginEmail for upsertMakeupUser");
    const id = randomUUID();
    const res = await client.query(
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


