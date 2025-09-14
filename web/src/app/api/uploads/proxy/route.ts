import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const uploadUrl = String(form.get("uploadUrl") || "");
    const file = form.get("file");
    if (!uploadUrl || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      // Intentionally omit headers to avoid mismatches with presign
    });
    if (!putRes.ok) {
      const text = await putRes.text();
      return NextResponse.json({ error: "R2 upload failed", status: putRes.status, body: text }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}


