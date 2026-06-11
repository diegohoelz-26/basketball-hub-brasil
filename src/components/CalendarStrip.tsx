'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarStripProps {
  selectedDate: string // "YYYY-MM-DD"
  endSlot?: React.ReactNode
}

const MONTH_NAMES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getTodayStrBRT(): string {
  return new Date().toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).split('/').reverse().join('-')
}

export default function CalendarStrip({ selectedDate, endSlot }: CalendarStripProps) {
  const router = useRouter()
  const todayStr = getTodayStrBRT()

  const [year, setYear]   = useState(() => parseInt(selectedDate.slice(0, 4)))
  const [month, setMonth] = useState(() => parseInt(selectedDate.slice(5, 7)) - 1)

  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [selectedDate, month])

  // Funções sem parâmetros — chamadas via () => para não receber o Event
  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function handleSelect(date: string) {
    router.push(`/?date=${date}`)
  }

  const totalDays = getDaysInMonth(year, month)

  return (
    <section className="bg-brand-dark border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4 py-2">

        {/* Cabeçalho: seta ← mês/ano seta → | slot opcional (ex: abas) */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => prevMonth()}
              className="p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-brand-card transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-white text-sm font-semibold select-none">
              {MONTH_NAMES[month]} {year}
            </span>

            <button
              onClick={() => nextMonth()}
              className="p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-brand-card transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {endSlot}
        </div>

        {/* Dias em scroll horizontal */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
            const dateStr    = toDateStr(year, month, day)
            const isSelected = dateStr === selectedDate
            const isToday    = dateStr === todayStr
            const isPast     = dateStr < todayStr

            return (
              <button
                key={day}
                ref={isSelected ? selectedRef : undefined}
                onClick={() => handleSelect(dateStr)}
                className={[
                  'flex-shrink-0 flex flex-col items-center gap-0.5 w-11 py-2 rounded-xl transition-all duration-150',
                  isSelected
                    ? 'bg-brand-orange text-white font-semibold'
                    : isToday
                    ? 'border border-brand-orange text-white'
                    : isPast
                    ? 'text-brand-muted hover:text-white hover:bg-brand-card'
                    : 'text-white/70 hover:text-white hover:bg-brand-card',
                ].join(' ')}
              >
                <span className="text-[10px] uppercase tracking-wider leading-none">
                  {new Date(year, month, day)
                    .toLocaleDateString('pt-BR', { weekday: 'short' })
                    .replace('.', '')}
                </span>
                <span className="text-base font-bold leading-none">{day}</span>
                {isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-brand-orange mt-0.5" />
                )}
              </button>
            )
          })}
        </div>

      </div>
    </section>
  )
}
