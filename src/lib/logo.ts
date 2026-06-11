/**
 * Retorna a URL da imagem para uso em <img> tags.
 * <img> tags carregam de qualquer domínio sem restrição de CORS.
 * Proxy server-side removido pois o CDN da API-Sports é inacessível
 * via conexão servidor→CDN neste ambiente.
 */
export function proxyLogo(url: string | null | undefined): string {
  return url ?? ''
}
