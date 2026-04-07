import { useState } from 'react'
import { useMealPlan } from '@/context/MealPlanContext'
import type { GerichtCard } from '@/lib/gerichte'

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'] as const
const WOCHENTAGE_KURZ = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const
const SLOTS = ['Frühstück', 'Mittagessen', 'Abendessen'] as const

const SLOT_EMOJI: Record<string, string> = {
  'Frühstück': '🌅',
  'Mittagessen': '☀️',
  'Abendessen': '🌙',
}

const SLOT_COLORS: Record<string, string> = {
  'Frühstück': 'bg-amber-50 border-amber-200',
  'Mittagessen': 'bg-orange-50 border-orange-200',
  'Abendessen': 'bg-indigo-50 border-indigo-200',
}

type Day = typeof WOCHENTAGE[number]
type Slot = typeof SLOTS[number]

export default function Wochenplan() {
  const { selected, plan, assignToPlan, removeFromPlan, getPlanEntry } = useMealPlan()
  const [dragging, setDragging] = useState<GerichtCard | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [placing, setPlacing] = useState<GerichtCard | null>(null)

  const assignedIds = new Set(plan.map((e) => e.gericht.id))
  const unassigned = selected.filter((g) => !assignedIds.has(g.id))

  const cellKey = (day: string, slot: string) => `${day}-${slot}`

  const handleDragStart = (gericht: GerichtCard) => {
    setDragging(gericht)
  }

  const handleDragOver = (e: React.DragEvent, day: string, slot: string) => {
    e.preventDefault()
    setDragOver(cellKey(day, slot))
  }

  const handleDrop = (day: Day, slot: Slot) => {
    if (!dragging) return
    assignToPlan(dragging, day, slot)
    setDragging(null)
    setDragOver(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDragOver(null)
  }

  const handleQuickAssign = (gericht: GerichtCard) => {
    for (const day of WOCHENTAGE) {
      for (const slot of SLOTS) {
        if (slot === gericht.kategorie && !getPlanEntry(day, slot)) {
          assignToPlan(gericht, day, slot)
          return
        }
      }
    }
    for (const day of WOCHENTAGE) {
      for (const slot of SLOTS) {
        if (!getPlanEntry(day, slot)) {
          assignToPlan(gericht, day, slot)
          return
        }
      }
    }
  }

  const handleMobileSlotTap = (day: Day, slot: Slot) => {
    const entry = getPlanEntry(day, slot)
    if (placing) {
      assignToPlan(placing, day, slot)
      setPlacing(null)
    } else if (entry) {
      setPlacing(entry.gericht)
      removeFromPlan(day, slot)
    }
  }

  const handleMobileDishTap = (gericht: GerichtCard) => {
    if (placing?.id === gericht.id) {
      setPlacing(null)
    } else {
      setPlacing(gericht)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Wochenplan</h1>
            <p className="text-sm text-gray-400 mt-0.5 hidden lg:block">
              Ziehe Gerichte auf die Wochentage — auch bereits platzierte Gerichte sind verschiebbar
            </p>
            <p className="text-sm text-gray-400 mt-0.5 lg:hidden">
              {placing
                ? `Tippe auf einen Slot, um "${placing.name}" zu platzieren`
                : 'Tippe auf ein Gericht, dann auf einen Slot'}
            </p>
          </div>
          <div className="text-sm text-gray-400">
            {plan.length} / 21
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1">
            <div />
            {WOCHENTAGE.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}

            {SLOTS.map((slot) => (
              <>
                <div key={`label-${slot}`} className="flex items-center gap-1.5 pr-3 text-sm font-medium text-gray-500 whitespace-nowrap">
                  <span>{SLOT_EMOJI[slot]}</span>
                  <span>{slot}</span>
                </div>
                {WOCHENTAGE.map((day) => {
                  const entry = getPlanEntry(day, slot)
                  const isOver = dragOver === cellKey(day, slot)
                  return (
                    <div
                      key={cellKey(day, slot)}
                      className={`min-h-[80px] rounded-xl border-2 border-dashed p-2 transition-colors ${
                        isOver
                          ? 'border-[#78A75A] bg-[#78A75A]/5'
                          : entry
                            ? `${SLOT_COLORS[slot]} border-solid`
                            : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                      }`}
                      onDragOver={(e) => handleDragOver(e, day, slot)}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={() => handleDrop(day, slot)}
                    >
                      {entry ? (
                        <div
                          className="group relative h-full cursor-grab active:cursor-grabbing"
                          draggable
                          onDragStart={() => handleDragStart(entry.gericht)}
                          onDragEnd={handleDragEnd}
                        >
                          <p className="text-sm font-medium text-gray-800 leading-tight">
                            {entry.gericht.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {entry.gericht.kostenEuro.toFixed(2)}€
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFromPlan(day, slot) }}
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                          +
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>

        {/* Mobile list */}
        <div className="lg:hidden space-y-4">
          {placing && (
            <div className="sticky top-0 z-10 bg-[#78A75A]/10 border border-[#78A75A]/30 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{SLOT_EMOJI[placing.kategorie] ?? '🍽️'}</span>
                <span className="text-sm font-medium text-[#78A75A]">{placing.name}</span>
              </div>
              <button
                onClick={() => setPlacing(null)}
                className="text-sm text-[#78A75A]/60 hover:text-[#78A75A]"
              >
                Abbrechen
              </button>
            </div>
          )}

          {WOCHENTAGE.map((day, i) => (
            <div key={day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">{day}</h3>
                <p className="text-xs text-gray-400">{WOCHENTAGE_KURZ[i]}</p>
              </div>
              <div className="divide-y divide-gray-50">
                {SLOTS.map((slot) => {
                  const entry = getPlanEntry(day, slot)
                  const isPlaceTarget = placing !== null
                  return (
                    <div
                      key={cellKey(day, slot)}
                      className={`px-4 py-3 flex items-center gap-3 transition-colors ${
                        isPlaceTarget ? 'cursor-pointer active:bg-[#78A75A]/5' : ''
                      } ${isPlaceTarget && !entry ? 'bg-green-50/50' : ''}`}
                      onClick={() => handleMobileSlotTap(day, slot)}
                    >
                      <span className="text-lg">{SLOT_EMOJI[slot]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">{slot}</p>
                        {entry ? (
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {entry.gericht.name}
                            </p>
                            {!placing && (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFromPlan(day, slot) }}
                                className="text-gray-300 hover:text-red-400 text-xs ml-2"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className={`text-sm italic ${isPlaceTarget ? 'text-[#78A75A]' : 'text-gray-300'}`}>
                            {isPlaceTarget ? 'Hier platzieren' : 'Noch frei'}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50/50 p-4 lg:p-6 lg:w-72 overflow-y-auto">
        <h2 className="font-bold text-gray-800 mb-1">Verfügbare Gerichte</h2>
        <p className="text-xs text-gray-400 mb-4">
          {unassigned.length > 0
            ? 'Tippe oder ziehe ein Gericht auf einen Slot'
            : 'Alle Gerichte wurden zugewiesen'}
        </p>

        <div className="space-y-2">
          {unassigned.map((g) => (
            <div
              key={g.id}
              draggable
              onDragStart={() => handleDragStart(g)}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (window.matchMedia('(min-width: 1024px)').matches) {
                  handleQuickAssign(g)
                } else {
                  handleMobileDishTap(g)
                }
              }}
              className={`flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all border ${
                placing?.id === g.id
                  ? 'border-[#78A75A] ring-2 ring-[#78A75A]/20'
                  : 'border-gray-100'
              }`}
            >
              <span className="text-lg">{SLOT_EMOJI[g.kategorie] ?? '🍽️'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{g.name}</p>
                <p className="text-xs text-gray-400">{g.kategorie} · {g.kostenEuro.toFixed(2)}€</p>
              </div>
            </div>
          ))}
        </div>

        {plan.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Geschätzte Kosten</span>
              <span className="font-semibold text-gray-800">
                {plan.reduce((sum, e) => sum + e.gericht.kostenEuro, 0).toFixed(2)}€
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
