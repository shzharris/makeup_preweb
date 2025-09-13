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

export type UpsertMakeupUserParams = {
  loginEmail: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  loginType: string;
};

export async function upsertMakeupUser(params: UpsertMakeupUserParams): Promise<void> {
  const { loginEmail, nickname, avatarUrl, loginType } = params;
  const client = await pool.connect();
  try {
    const email = (loginEmail ?? "").trim().toLowerCase();
    if (!email) throw new Error("Missing loginEmail for upsertMakeupUser");
    const id = randomUUID();
    await client.query(
      `
      INSERT INTO public.makeup_user (id, created_at, nickname, avatar_url, login_email, login_type)
      VALUES ($1, NOW(), $2, $3, $4, $5)
      ON CONFLICT (login_email)
      DO UPDATE SET
        nickname = EXCLUDED.nickname,
        avatar_url = EXCLUDED.avatar_url,
        login_type = EXCLUDED.login_type
      `,
      [id, nickname ?? "", avatarUrl ?? "", email, loginType]
    );
  } finally {
    client.release();
  }
}


