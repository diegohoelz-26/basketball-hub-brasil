// Route Handler — proxy de imagens da API-Sports
// Evita bloqueio de CORS/hotlink do media.api-sports.io
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTNAME = 'media.api-sports.io'
const CACHE_SECONDS    = 60 * 60 * 24 * 7 // 7 dias — logos não mudam

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  // 1. Valida presença do parâmetro
  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  // 2. Valida que é uma URL real
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  // 3. Só permite imagens do domínio da API-Sports (segurança)
  if (parsed.hostname !== ALLOWED_HOSTNAME) {
    return new NextResponse('Domain not allowed', { status: 403 })
  }

  // 4. Busca a imagem no servidor (sem restrição de CORS)
  try {
    const response = await fetch(url, {
      headers: {
        // Simula browser para evitar bloqueio por user-agent
        'User-Agent': 'Mozilla/5.0 (compatible; BasketballHubBot/1.0)',
      },
      next: { revalidate: CACHE_SECONDS },
    })

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const contentType = response.headers.get('content-type') ?? 'image/png'
    const buffer      = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':  contentType,
        'Cache-Control': `public, max-age=${CACHE_SECONDS}, immutable`,
      },
    })
  } catch {
    return new NextResponse('Failed to fetch image', { status: 502 })
  }
}
