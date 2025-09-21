import { NextResponse } from "next/server";
import { listAllBlogTags } from "@/lib/db";

export async function GET() {
  const items = await listAllBlogTags();
  return NextResponse.json({ items });
}


