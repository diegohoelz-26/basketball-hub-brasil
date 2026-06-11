import type { Metadata } from 'next'
import { Geist, Geist_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const bebasNeue = Bebas_Neue({
  variable: '--font-display',
  weight: '400',
  subsets: ['latin'],
})

const SITE_URL = 'https://basketballhub.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Basketball Hub Brasil — Todos os jogos de basquete em um só lugar',
    template: '%s · Basketball Hub Brasil',
  },
  description:
    'Placares ao vivo, calendário completo e onde assistir. NBA, WNBA, NBB, EuroLeague e Liga ACB.',
  keywords: [
    'basquete', 'basketball', 'NBA', 'WNBA', 'NBB', 'EuroLeague', 'ACB',
    'jogos ao vivo', 'placar', 'onde assistir basquete',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Basketball Hub Brasil',
    title: 'Basketball Hub Brasil — Todos os jogos de basquete em um só lugar',
    description:
      'Placares ao vivo, calendário completo e onde assistir. NBA, WNBA, NBB, EuroLeague e Liga ACB.',
  },
  twitter: {
    card: 'summary',
    title: 'Basketball Hub Brasil',
    description: 'Placares ao vivo, calendário completo e onde assistir.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
