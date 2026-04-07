import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { fetchGerichte, type GerichtCard } from '@/lib/gerichte'
import { rankByOverlap, countOverlapping } from '@/lib/overlap'
import { useMealPlan } from '@/context/MealPlanContext'

const KATEGORIE_COLORS: Record<string, string> = {
  'Frühstück': 'bg-amber-400',
  'Mittagessen': 'bg-orange-400',
  'Abendessen': 'bg-indigo-400',
  'Snack': 'bg-pink-400',
}

const KATEGORIE_TEXT_COLORS: Record<string, string> = {
  'Frühstück': 'text-amber-600 bg-amber-50',
  'Mittagessen': 'text-orange-600 bg-orange-50',
  'Abendessen': 'text-indigo-600 bg-indigo-50',
  'Snack': 'text-pink-600 bg-pink-50',
}

const KATEGORIE_EMOJI: Record<string, string> = {
  'Frühstück': '🌅',
  'Mittagessen': '☀️',
  'Abendessen': '🌙',
  'Snack': '🍿',
}

const MIN_GERICHTE = 3
const PLAN_GOAL = 7

export default function Entdecken() {
  const { selected, skipped, history, select, skip, undo, remove } = useMealPlan()
  const [allGerichte, setAllGerichte] = useState<GerichtCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGerichte()
      .then(setAllGerichte)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Read onboarding data
  const onboardingData = (() => {
    try {
      return JSON.parse(localStorage.getItem('onboarding_data') ?? '{}')
    } catch {
      return {}
    }
  })()

  const alpha: number = onboardingData.preferenceAlpha ?? 0.5
  const anchorGerichtIds: string[] = onboardingData.anchorGerichtIds ?? []
  const anchorZutatenNames: string[] = onboardingData.anchorZutaten ?? []

  // Build anchor zutat ID set from anchor gerichte + anchor zutat names
  const anchorIds = (() => {
    const ids = new Set<string>()
    for (const g of allGerichte) {
      if (anchorGerichtIds.includes(g.id)) {
        for (const id of g.zutatIds) ids.add(id)
      }
      for (const z of g.zutaten) {
        if (anchorZutatenNames.includes(z.name)) ids.add(z.id)
      }
    }
    return ids
  })()

  // Anchor zutat names for display
  const anchorZutatNamesSet = new Set(anchorZutatenNames)
  const anchorGerichtIdsSet = new Set(anchorGerichtIds)

  // Count how many anchor zutaten a candidate shares
  const countAnchorOverlap = (gericht: GerichtCard) => {
    let count = 0
    for (const z of gericht.zutaten) {
      if (anchorIds.has(z.id)) count++
    }
    return count
  }

  const candidates = rankByOverlap(
    allGerichte.filter(
      (g) => !selected.some((s) => s.id === g.id) && !skipped.has(g.id),
    ),
    selected,
    alpha,
    anchorIds,
  )

  const current = candidates[0] ?? null
  const next1 = candidates[1] ?? null
  const next2 = candidates[2] ?? null

  const handleSwipeRight = () => { if (current) select(current) }
  const handleSwipeLeft = () => { if (current) skip(current) }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#78A75A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">Fehler beim Laden</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    )
  }

  const progress = Math.min(selected.length / PLAN_GOAL, 1)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Main area */}
      <div className="flex flex-col flex-1 px-4 pt-4 lg:px-8 overflow-hidden">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-1.5">
            <span className="font-medium text-gray-700">
              {selected.length < MIN_GERICHTE
                ? `Noch ${MIN_GERICHTE - selected.length} Gerichte bis zum Wochenplan`
                : selected.length < PLAN_GOAL
                  ? `${selected.length} Gerichte gewählt — Ziel: ${PLAN_GOAL}`
                  : 'Wochenplan komplett!'}
            </span>
            <span className="text-gray-400 text-xs">{selected.length}/{PLAN_GOAL}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: selected.length < MIN_GERICHTE ? '#f59e0b' : '#78A75A',
              }}
            />
          </div>
          {selected.length < MIN_GERICHTE && (
            <p className="text-xs text-amber-500 mt-1">
              Mindestens {MIN_GERICHTE} Gerichte nötig, um den Wochenplan zu öffnen
            </p>
          )}
        </div>

        {/* Selected chips — mobile only */}
        {selected.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:hidden">
            {selected.map((g) => (
              <button
                key={g.id}
                onClick={() => remove(g.id)}
                className="flex-shrink-0 flex items-center gap-1 rounded-full bg-[#78A75A]/10 px-3 py-1.5 text-xs font-medium text-[#78A75A]"
              >
                {g.name}
                <span className="text-[#78A75A]/60 ml-0.5">✕</span>
              </button>
            ))}
          </div>
        )}

        {/* Stats bar */}
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <span>{selected.length} Gerichte gewählt</span>
          <span>{candidates.length} übrig</span>
        </div>

        {/* ===== MOBILE: Swipe cards ===== */}
        <div className="flex-1 flex flex-col lg:hidden">
          <div className="flex-1 flex items-center justify-center">
            {current ? (
              <div className="relative w-full max-w-sm">
                {next2 && (
                  <div className="absolute inset-0 rounded-2xl bg-gray-50 border border-gray-200 shadow-lg translate-y-5 scale-[0.90] opacity-50 pointer-events-none" />
                )}
                {next1 && (
                  <div className="absolute inset-0 rounded-2xl bg-gray-50 border border-gray-200 shadow-lg translate-y-2.5 scale-[0.95] opacity-70 pointer-events-none" />
                )}
                <SwipeCard
                  key={current.id}
                  gericht={current}
                  overlapCount={countOverlapping(current, selected)}
                  anchorOverlap={countAnchorOverlap(current)}
                  totalSelected={selected.length}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                />
              </div>
            ) : (
              <EmptyState count={selected.length} />
            )}
          </div>

          {current && (
            <div className="flex justify-center items-center gap-4 py-6">
              <button
                onClick={undo}
                disabled={history.length === 0}
                className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-lg shadow-sm transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Rückgängig"
              >
                ↩
              </button>
              <button
                onClick={handleSwipeLeft}
                className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl shadow-sm active:scale-90 transition-transform"
              >
                ✕
              </button>
              <button
                onClick={handleSwipeRight}
                className="w-16 h-16 rounded-full bg-[#78A75A] flex items-center justify-center text-2xl text-white shadow-md active:scale-90 transition-transform"
              >
                ♥
              </button>
            </div>
          )}
        </div>

        {/* ===== DESKTOP: Grid of cards ===== */}
        <div className="hidden lg:flex flex-col flex-1 overflow-hidden">
          {history.length > 0 && (
            <div className="mb-3">
              <button
                onClick={undo}
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors"
              >
                <span>↩</span>
                <span>Rückgängig</span>
              </button>
            </div>
          )}

          {candidates.length > 0 ? (
            <div className="flex-1 overflow-y-auto pb-4 pr-1">
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {candidates.map((gericht) => (
                  <DesktopCard
                    key={gericht.id}
                    gericht={gericht}
                    overlapCount={countOverlapping(gericht, selected)}
                    anchorOverlap={countAnchorOverlap(gericht)}
                    totalSelected={selected.length}
                    onSelect={() => select(gericht)}
                    onSkip={() => skip(gericht)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState count={selected.length} />
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-80 border-l border-gray-100 bg-gray-50/50 p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Deine Auswahl</h2>
        {selected.length === 0 ? (
          <p className="text-sm text-gray-400">
            Klicke auf + um Gerichte hinzuzufügen.
          </p>
        ) : (
          <div className="space-y-2">
            {selected.map((g) => {
              const emoji = KATEGORIE_EMOJI[g.kategorie] ?? '🍽️'
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm group"
                >
                  <span className="text-xl">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{g.name}</p>
                    <p className="text-xs text-gray-400">{g.kategorie} · {g.kostenEuro.toFixed(2)}€</p>
                  </div>
                  <button
                    onClick={() => remove(g.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-opacity text-sm"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}
        {selected.length >= MIN_GERICHTE && (
          <Link
            to="/wochenplan"
            className="mt-6 block w-full py-3 bg-[#78A75A] text-white font-medium rounded-xl shadow-md hover:bg-[#6a954e] transition-colors text-center"
          >
            Wochenplan erstellen
          </Link>
        )}
      </div>
    </div>
  )
}

function EmptyState({ count }: { count: number }) {
  return (
    <div className="text-center">
      <p className="text-4xl mb-3">🎉</p>
      <p className="text-xl font-bold text-gray-800">Alle Gerichte gesehen!</p>
      <p className="text-gray-500 mt-2">
        Du hast {count} Gerichte ausgewählt.
      </p>
    </div>
  )
}

/* ─── Desktop grid card ─── */
function DesktopCard({
  gericht,
  overlapCount,
  anchorOverlap,
  totalSelected,
  onSelect,
  onSkip,
}: {
  gericht: GerichtCard
  overlapCount: number
  anchorOverlap: number
  totalSelected: number
  onSelect: () => void
  onSkip: () => void
}) {
  const bgColor = KATEGORIE_COLORS[gericht.kategorie] ?? 'bg-gray-400'
  const tagColor = KATEGORIE_TEXT_COLORS[gericht.kategorie] ?? 'text-gray-600 bg-gray-50'
  const emoji = KATEGORIE_EMOJI[gericht.kategorie] ?? '🍽️'
  const topZutaten = gericht.zutaten.slice(0, 4)
  const moreCount = gericht.zutaten.length - 4

  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
      <div className={`${bgColor} px-4 py-5 relative`}>
        <span className="text-3xl">{emoji}</span>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagColor}`}>
            {gericht.kategorie}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 leading-tight">{gericht.name}</h3>
          <span className="text-sm font-semibold text-[#78A75A] whitespace-nowrap">
            {gericht.kostenEuro.toFixed(2)}€
          </span>
        </div>

        {gericht.beschreibung && (
          <p className="text-xs text-gray-400 line-clamp-2">{gericht.beschreibung}</p>
        )}

        {/* Anchor match indicator */}
        {anchorOverlap > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
            <span>⚓</span>
            <span>Passt zu deinen Favoriten</span>
          </div>
        )}

        {totalSelected > 0 && overlapCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#78A75A]">
            <span>🔗</span>
            <span>
              {overlapCount} {overlapCount === 1 ? 'gemeinsame Zutat' : 'gemeinsame Zutaten'}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {topZutaten.map((z) => (
            <span key={z.name} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {z.name}
            </span>
          ))}
          {moreCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              +{moreCount}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onSkip}
            className="flex-1 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            Überspringen
          </button>
          <button
            onClick={onSelect}
            className="flex-1 py-2 text-sm font-medium text-white bg-[#78A75A] rounded-xl hover:bg-[#6a954e] transition-colors shadow-sm"
          >
            + Auswählen
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile swipe card ─── */
function SwipeCard({
  gericht,
  overlapCount,
  anchorOverlap,
  totalSelected,
  onSwipeRight,
  onSwipeLeft,
}: {
  gericht: GerichtCard
  overlapCount: number
  anchorOverlap: number
  totalSelected: number
  onSwipeRight: () => void
  onSwipeLeft: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const isDragging = useRef(false)
  const [offset, setOffset] = useState(0)
  const [decided, setDecided] = useState<'left' | 'right' | null>(null)

  const handleStart = useCallback((clientX: number) => {
    isDragging.current = true
    startX.current = clientX
    currentX.current = clientX
  }, [])

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return
    currentX.current = clientX
    setOffset(clientX - startX.current)
  }, [])

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    const dx = currentX.current - startX.current
    if (dx > 100) {
      setDecided('right')
      setOffset(400)
      setTimeout(onSwipeRight, 200)
    } else if (dx < -100) {
      setDecided('left')
      setOffset(-400)
      setTimeout(onSwipeLeft, 200)
    } else {
      setOffset(0)
    }
  }, [onSwipeRight, onSwipeLeft])

  const rotation = offset * 0.08
  const opacity = decided ? 0 : 1

  const topZutaten = gericht.zutaten.slice(0, 5)
  const moreCount = gericht.zutaten.length - 5
  const bgColor = KATEGORIE_COLORS[gericht.kategorie] ?? 'bg-gray-400'
  const emoji = KATEGORIE_EMOJI[gericht.kategorie] ?? '🍽️'

  return (
    <div
      ref={cardRef}
      className="w-full max-w-sm select-none touch-none relative z-10"
      style={{
        transform: `translateX(${offset}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging.current ? 'none' : 'all 0.3s ease-out',
      }}
      onPointerDown={(e) => handleStart(e.clientX)}
      onPointerMove={(e) => handleMove(e.clientX)}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
    >
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100">
        <div className={`${bgColor} px-5 py-8 text-white relative`}>
          <span className="text-5xl">{emoji}</span>
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
            {gericht.kategorie}
          </div>
          {offset > 50 && (
            <div className="absolute top-4 left-4 bg-green-500 text-white rounded-lg px-3 py-1 text-sm font-bold rotate-[-12deg]">
              YUM!
            </div>
          )}
          {offset < -50 && (
            <div className="absolute top-4 right-4 bg-red-400 text-white rounded-lg px-3 py-1 text-sm font-bold rotate-[12deg]">
              NOPE
            </div>
          )}
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-gray-900">{gericht.name}</h2>
            <span className="text-lg font-semibold text-[#78A75A] whitespace-nowrap ml-2">
              {gericht.kostenEuro.toFixed(2)}€
            </span>
          </div>

          {gericht.beschreibung && (
            <p className="text-sm text-gray-500">{gericht.beschreibung}</p>
          )}

          {anchorOverlap > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
              <span className="text-sm">⚓</span>
              <span className="text-sm font-medium text-amber-700">
                Passt zu deinen Favoriten
              </span>
            </div>
          )}

          {totalSelected > 0 && overlapCount > 0 && (
            <div className="flex items-center gap-2 bg-[#78A75A]/10 rounded-lg px-3 py-2">
              <span className="text-sm">🔗</span>
              <span className="text-sm font-medium text-[#78A75A]">
                {overlapCount} {overlapCount === 1 ? 'Zutat' : 'Zutaten'} bereits in deiner Auswahl
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {topZutaten.map((z) => (
              <span key={z.name} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {z.name}
              </span>
            ))}
            {moreCount > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-400">
                +{moreCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
