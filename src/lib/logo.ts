/**
 * Converte uma URL de imagem da API-Sports para a rota de proxy local.
 * O proxy busca a imagem no servidor (com a chave da API), evitando
 * restrições de hotlinking/CORS no browser.
 */
export function proxyLogo(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('https://media.api-sports.io/')) {
    return `/api/logo?url=${encodeURIComponent(url)}`
  }
  return url
}
