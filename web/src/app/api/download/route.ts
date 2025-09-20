import { NextRequest, NextResponse } from "next/server";

// 通过服务端代理下载远端图片，避免浏览器 CORS 限制
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "missing url" }, { status: 400 });
  }

  try {
    // 简单白名单校验，限制到 R2 公网域名，或显式允许的公共前缀
    const allowedPrefix = process.env.R2_PUBLIC_BASE_URL?.trim();
    const isAllowed =
      (allowedPrefix && url.startsWith(allowedPrefix)) ||
      url.includes('.r2.cloudflarestorage.com/');
    if (!isAllowed) {
      return NextResponse.json({ error: "url not allowed" }, { status: 400 });
    }

    const upstream = await fetch(url);
    if (!upstream.ok) {
      return NextResponse.json({ error: `upstream ${upstream.status}` }, { status: 502 });
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const contentLength = upstream.headers.get('content-length') ?? undefined;
    // 从 URL 推导一个文件名
    const pathname = new URL(url).pathname;
    const guessedName = pathname.split('/').pop() || 'download.bin';

    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': contentType,
        ...(contentLength ? { 'Content-Length': contentLength } : {}),
        'Cache-Control': 'private, max-age=0, no-store',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(guessedName)}`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}


