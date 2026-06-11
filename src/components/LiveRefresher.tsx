'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LIVE_REFRESH_INTERVAL } from '@/constants'

/** Dispara router.refresh() a cada LIVE_REFRESH_INTERVAL ms enquanto houver jogos ao vivo. */
export default function LiveRefresher({ isActive }: { isActive: boolean }) {
  const router = useRouter()

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => router.refresh(), LIVE_REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [isActive, router])

  return null
}
