import { createContext, useContext, useState, type ReactNode } from 'react'
import type { GerichtCard } from '@/lib/gerichte'

type HistoryEntry = {
  action: 'select' | 'skip'
  gericht: GerichtCard
}

export type PlanEntry = {
  day: string
  slot: string
  gericht: GerichtCard
}

interface MealPlanState {
  selected: GerichtCard[]
  skipped: Set<string>
  history: HistoryEntry[]
  select: (gericht: GerichtCard) => void
  skip: (gericht: GerichtCard) => void
  undo: () => void
  remove: (id: string) => void
  plan: PlanEntry[]
  assignToPlan: (gericht: GerichtCard, day: string, slot: string) => void
  removeFromPlan: (day: string, slot: string) => void
  getPlanEntry: (day: string, slot: string) => PlanEntry | undefined
}

const MealPlanContext = createContext<MealPlanState | null>(null)

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<GerichtCard[]>([])
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [plan, setPlan] = useState<PlanEntry[]>([])

  const select = (gericht: GerichtCard) => {
    setHistory((prev) => [...prev, { action: 'select', gericht }])
    setSelected((prev) => [...prev, gericht])
  }

  const skip = (gericht: GerichtCard) => {
    setHistory((prev) => [...prev, { action: 'skip', gericht }])
    setSkipped((prev) => new Set(prev).add(gericht.id))
  }

  const undo = () => {
    const last = history[history.length - 1]
    if (!last) return
    setHistory((prev) => prev.slice(0, -1))
    if (last.action === 'select') {
      setSelected((prev) => prev.filter((g) => g.id !== last.gericht.id))
    } else {
      setSkipped((prev) => {
        const next = new Set(prev)
        next.delete(last.gericht.id)
        return next
      })
    }
  }

  const remove = (id: string) => {
    setSelected((prev) => prev.filter((g) => g.id !== id))
    setHistory((prev) => prev.filter((h) => !(h.action === 'select' && h.gericht.id === id)))
    setPlan((prev) => prev.filter((e) => e.gericht.id !== id))
  }

  const assignToPlan = (gericht: GerichtCard, day: string, slot: string) => {
    setPlan((prev) => [
      ...prev.filter((e) => !(e.day === day && e.slot === slot) && e.gericht.id !== gericht.id),
      { day, slot, gericht },
    ])
  }

  const removeFromPlan = (day: string, slot: string) => {
    setPlan((prev) => prev.filter((e) => !(e.day === day && e.slot === slot)))
  }

  const getPlanEntry = (day: string, slot: string) =>
    plan.find((e) => e.day === day && e.slot === slot)

  return (
    <MealPlanContext.Provider value={{
      selected, skipped, history, select, skip, undo, remove,
      plan, assignToPlan, removeFromPlan, getPlanEntry,
    }}>
      {children}
    </MealPlanContext.Provider>
  )
}

export function useMealPlan() {
  const ctx = useContext(MealPlanContext)
  if (!ctx) throw new Error('useMealPlan must be used within MealPlanProvider')
  return ctx
}
