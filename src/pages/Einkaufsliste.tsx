import { useState, useMemo } from 'react'
import { useMealPlan } from '@/context/MealPlanContext'

const KATEGORIE_ORDER: Record<string, number> = {
  'Obst': 0,
  'Gemüse': 1,
  'Fleisch': 2,
  'Fisch': 3,
  'Milchprodukte': 4,
  'Getreide': 5,
  'Gewürze': 6,
  'Sonstiges': 7,
  'Eigene': 8,
}

const KATEGORIE_EMOJI: Record<string, string> = {
  'Obst': '🍎',
  'Gemüse': '🥬',
  'Fleisch': '🥩',
  'Fisch': '🐟',
  'Milchprodukte': '🧀',
  'Getreide': '🌾',
  'Gewürze': '🧂',
  'Sonstiges': '📦',
  'Eigene': '✏️',
}

const KATEGORIE_COLORS: Record<string, string> = {
  'Obst': 'bg-red-50 text-red-700',
  'Gemüse': 'bg-green-50 text-green-700',
  'Fleisch': 'bg-rose-50 text-rose-700',
  'Fisch': 'bg-cyan-50 text-cyan-700',
  'Milchprodukte': 'bg-yellow-50 text-yellow-700',
  'Getreide': 'bg-amber-50 text-amber-700',
  'Gewürze': 'bg-orange-50 text-orange-700',
  'Sonstiges': 'bg-gray-50 text-gray-700',
  'Eigene': 'bg-purple-50 text-purple-700',
}

type ShoppingItem = {
  id: string
  name: string
  menge: number
  einheit: string
  kategorie: string
  gerichte: string[]
  custom: boolean
}

export default function Einkaufsliste() {
  const { plan } = useMealPlan()
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [customItems, setCustomItems] = useState<ShoppingItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemMenge, setNewItemMenge] = useState('')
  const [newItemEinheit, setNewItemEinheit] = useState('Stk')
  const [showAddForm, setShowAddForm] = useState(false)

  // Aggregate ingredients from all plan entries
  const aggregatedItems = useMemo(() => {
    const map = new Map<string, ShoppingItem>()

    for (const entry of plan) {
      for (const z of entry.gericht.zutaten) {
        const key = `${z.name}-${z.einheit}`
        const existing = map.get(key)
        if (existing) {
          existing.menge += z.menge
          if (!existing.gerichte.includes(entry.gericht.name)) {
            existing.gerichte.push(entry.gericht.name)
          }
        } else {
          map.set(key, {
            id: key,
            name: z.name,
            menge: z.menge,
            einheit: z.einheit,
            kategorie: z.kategorie,
            gerichte: [entry.gericht.name],
            custom: false,
          })
        }
      }
    }

    return Array.from(map.values())
  }, [plan])

  const allItems = [...aggregatedItems, ...customItems]

  // Group by category, sorted
  const grouped = useMemo(() => {
    const groups = new Map<string, ShoppingItem[]>()
    for (const item of allItems) {
      const cat = item.kategorie
      if (!groups.has(cat)) groups.set(cat, [])
      groups.get(cat)!.push(item)
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => (KATEGORIE_ORDER[a] ?? 99) - (KATEGORIE_ORDER[b] ?? 99))
  }, [allItems])

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const checkedCount = checked.size
  const totalCount = allItems.length

  const addCustomItem = () => {
    const name = newItemName.trim()
    if (!name) return
    const menge = parseFloat(newItemMenge) || 1
    setCustomItems((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name,
        menge,
        einheit: newItemEinheit,
        kategorie: 'Eigene',
        gerichte: [],
        custom: true,
      },
    ])
    setNewItemName('')
    setNewItemMenge('')
    setNewItemEinheit('Stk')
    setShowAddForm(false)
  }

  const removeCustomItem = (id: string) => {
    setCustomItems((prev) => prev.filter((i) => i.id !== id))
    setChecked((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const clearChecked = () => setChecked(new Set())

  if (plan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
        <p className="text-4xl mb-3">🛒</p>
        <p className="text-xl font-bold text-gray-800">Noch keine Einkaufsliste</p>
        <p className="text-gray-500 mt-2">
          Weise Gerichte im Wochenplan zu, um die Einkaufsliste automatisch zu erstellen.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Main list */}
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Einkaufsliste</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {checkedCount === 0
                ? `${totalCount} Zutaten aus ${plan.length} Gerichten`
                : `${checkedCount} von ${totalCount} erledigt`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Zurücksetzen
              </button>
            )}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-sm font-medium bg-[#78A75A] text-white rounded-lg hover:bg-[#6a954e] transition-colors"
            >
              + Hinzufügen
            </button>
          </div>
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="mb-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#78A75A] rounded-full transition-all duration-300"
              style={{ width: `${(checkedCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        {/* Add custom item form */}
        {showAddForm && (
          <div className="mb-4 bg-purple-50/50 border border-purple-100 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Eigene Zutat hinzufügen</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Name"
                className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#78A75A]/30 focus:border-[#78A75A]"
                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                autoFocus
              />
              <input
                type="number"
                value={newItemMenge}
                onChange={(e) => setNewItemMenge(e.target.value)}
                placeholder="Menge"
                className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#78A75A]/30 focus:border-[#78A75A]"
                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
              />
              <select
                value={newItemEinheit}
                onChange={(e) => setNewItemEinheit(e.target.value)}
                className="w-20 px-2 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#78A75A]/30 focus:border-[#78A75A]"
              >
                <option>Stk</option>
                <option>g</option>
                <option>kg</option>
                <option>ml</option>
                <option>l</option>
                <option>EL</option>
                <option>TL</option>
                <option>Prise</option>
                <option>Packung</option>
              </select>
              <button
                onClick={addCustomItem}
                disabled={!newItemName.trim()}
                className="px-4 py-2 text-sm font-medium bg-[#78A75A] text-white rounded-lg hover:bg-[#6a954e] transition-colors disabled:opacity-40"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-6">
          {grouped.map(([kategorie, items]) => {
            const emoji = KATEGORIE_EMOJI[kategorie] ?? '📦'
            const colorClass = KATEGORIE_COLORS[kategorie] ?? 'bg-gray-50 text-gray-700'
            const allChecked = items.every((i) => checked.has(i.id))
            return (
              <div key={kategorie}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
                    {emoji} {kategorie}
                  </span>
                  <span className="text-xs text-gray-300">
                    {items.filter((i) => checked.has(i.id)).length}/{items.length}
                  </span>
                  {allChecked && <span className="text-xs text-[#78A75A]">✓</span>}
                </div>

                {/* Items */}
                <div className="space-y-1">
                  {items.map((item) => {
                    const isChecked = checked.has(item.id)
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-gray-50 opacity-60'
                            : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#78A75A] border-[#78A75A]'
                            : 'border-gray-300'
                        }`}>
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {item.name}
                          </p>
                          {item.gerichte.length > 0 && (
                            <p className="text-xs text-gray-400 truncate hidden lg:block">
                              {item.gerichte.join(', ')}
                            </p>
                          )}
                        </div>

                        {/* Quantity */}
                        <span className={`text-sm whitespace-nowrap ${isChecked ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatMenge(item.menge)} {item.einheit}
                        </span>

                        {/* Remove custom item */}
                        {item.custom && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeCustomItem(item.id) }}
                            className="text-gray-300 hover:text-red-400 text-xs ml-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop sidebar: summary */}
      <div className="hidden lg:flex flex-col w-72 border-l border-gray-100 bg-gray-50/50 p-6 overflow-y-auto">
        <h2 className="font-bold text-gray-800 mb-4">Zusammenfassung</h2>

        {/* Progress ring */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="#78A75A" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(checkedCount / Math.max(totalCount, 1)) * 264} 264`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{checkedCount}</span>
              <span className="text-xs text-gray-400">von {totalCount}</span>
            </div>
          </div>
        </div>

        {/* Category summary */}
        <div className="space-y-2">
          {grouped.map(([kategorie, items]) => {
            const done = items.filter((i) => checked.has(i.id)).length
            const emoji = KATEGORIE_EMOJI[kategorie] ?? '📦'
            return (
              <div key={kategorie} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {emoji} {kategorie}
                </span>
                <span className={done === items.length ? 'text-[#78A75A] font-medium' : 'text-gray-400'}>
                  {done}/{items.length}
                </span>
              </div>
            )
          })}
        </div>

        {/* Cost estimate */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Geschätzte Kosten</span>
            <span className="font-semibold text-gray-800">
              {plan.reduce((sum, e) => sum + e.gericht.kostenEuro, 0).toFixed(2)}€
            </span>
          </div>
        </div>

        {/* Gerichte in plan */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-2">Gerichte im Plan</p>
          <div className="space-y-1">
            {plan.map((e) => (
              <p key={`${e.day}-${e.slot}`} className="text-xs text-gray-500 truncate">
                {e.gericht.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatMenge(n: number): string {
  if (n === Math.floor(n)) return n.toString()
  return n.toFixed(1)
}
