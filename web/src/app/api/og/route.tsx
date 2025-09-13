import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Makeup Insight AI'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff1f5',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#be123c',
            fontFamily: 'sans-serif',
            padding: 40,
            textAlign: 'center',
          }}
        >
          {title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}


