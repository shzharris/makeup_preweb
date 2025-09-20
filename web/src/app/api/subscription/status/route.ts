import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getLatestSubscriptionByUserId } from "@/lib/db";

export async function GET(_req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const user = session?.user as (Session["user"] & { db_user_id?: string | null }) | undefined;
  const dbUserId = user?.db_user_id ?? null;
  if (!dbUserId) return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });

  const sub = await getLatestSubscriptionByUserId(dbUserId);
  if (!sub) return NextResponse.json({ ok: false, reason: "no_subscription" });
  if (sub.is_cacelled === 1) return NextResponse.json({ ok: false, reason: "cancelled" });

  const type = String(sub.subscriptions_type || "");
  // 优先使用 start_at/end_at 判断
  if (sub.start_at) {
    const now = Date.now();
    const startAt = Date.parse(sub.start_at);
    const endAt = sub.end_at ? Date.parse(sub.end_at) : undefined;
    const active = now >= startAt && (endAt ? now <= endAt : true);
    if (!active) return NextResponse.json({ ok: false, reason: "out_of_window" });
  } else {
    // 旧字段回退
    if (type === "2" || type === "3") {
      const toMinutes = (t: string) => { const [h,m] = t.split(":"); return parseInt(h||"0")*60 + parseInt(m||"0"); };
      const now = new Date();
      const start = sub.start_time ? toMinutes(sub.start_time) : 0;
      const end = sub.end_time ? toMinutes(sub.end_time) : 24*60;
      const cur = now.getHours()*60 + now.getMinutes();
      const active = cur >= start && cur <= end;
      if (!active) return NextResponse.json({ ok: false, reason: "out_of_window" });
    }
  }

  if (type === "1") {
    // 按次：需要检查是否已结算（用完）
    if (sub.is_settlement === 1) return NextResponse.json({ ok: false, reason: "settled" });
    return NextResponse.json({ ok: true, type: 1 });
  }
  if (type === "2" || type === "3") {
    return NextResponse.json({ ok: true, type: Number(type) });
  }
  return NextResponse.json({ ok: false, reason: "unknown_type" });
}


