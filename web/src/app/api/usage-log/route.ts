import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { insertUsageLog } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).db_user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "");
  const actionDataId = String(body.action_data_id || "");
  if (!action || !actionDataId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await insertUsageLog({
    makeupUserId: (session.user as any).db_user_id as string,
    action,
    actionDataId,
  });
  return NextResponse.json({ ok: true });
}


