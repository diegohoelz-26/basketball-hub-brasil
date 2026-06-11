import { type NextRequest, NextResponse } from 'next/server'

// SVG de fallback quando a imagem não existe ou a API retorna erro
const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="18" fill="#2A241D"/>
  <circle cx="20" cy="20" r="10" fill="none" stroke="#8A8070" stroke-width="1.5"/>
  <line x1="20" y1="2" x2="20" y2="38" stroke="#8A8070" stroke-width="1.5"/>
  <line x1="2" y1="20" x2="38" y2="20" stroke="#8A8070" stroke-width="1.5"/>
</svg>`

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  // Aceita somente URLs do CDN da API-Sports
  if (!url || !url.startsWith('https://media.api-sports.io/')) {
    return new NextResponse(FALLBACK_SVG, {
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'x-apisports-key': process.env.API_SPORTS_KEY ?? '',
      },
      // Logos mudam raramente — cache de 24h
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      console.error(`[logo proxy] CDN retornou ${res.status} para: ${url}`)
      return new NextResponse(FALLBACK_SVG, {
        headers: { 'Content-Type': 'image/svg+xml' },
      })
    }

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('Content-Type') ?? 'image/png'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch (err) {
    console.error(`[logo proxy] Exceção ao buscar: ${url}`, err)
    return new NextResponse(FALLBACK_SVG, {
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  }
}
