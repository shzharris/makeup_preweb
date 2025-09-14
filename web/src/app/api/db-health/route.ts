import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const res = await pool.query("select 1 as ok");
    return NextResponse.json({ ok: true, result: res.rows[0] });
  } catch (err) {
    console.error("[DB Health]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}


