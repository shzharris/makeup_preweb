import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { insertUsageLog } from "@/lib/db";
import type { Session } from "next-auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  type SessionUserWithDbId = NonNullable<Session["user"]> & { db_user_id?: string | null };
  const user = session?.user as SessionUserWithDbId | undefined;
  const dbUserId = user?.db_user_id ?? null;
  if (!user || !dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "");
  const actionDataId = String(body.action_data_id || "");
  if (!action || !actionDataId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await insertUsageLog({
    makeupUserId: dbUserId,
    action,
    actionDataId,
  });
  return NextResponse.json({ ok: true });
}


