import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { listMakeupUserPhotos } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const user = session?.user as (Session["user"] & { db_user_id?: string | null }) | undefined;
  const dbUserId = user?.db_user_id ?? null;
  if (!dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 24);
  const offset = Number(searchParams.get("offset") ?? 0);

  const rows = await listMakeupUserPhotos({ makeupUserId: dbUserId, limit, offset });
  const data = rows.map((r) => ({
    id: r.id,
    originalUrl: r.original_url,
    processedUrl: r.processed_url ?? "",
    processedAt: r.created_at,
    status: (r.status as "completed" | "processing" | "failed" | null) ?? "completed",
  }));
  return NextResponse.json({ items: data });
}


