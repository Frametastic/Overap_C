import { useState, useEffect } from 'react'
import logo from '@/assets/logo.svg'
import geldImg from '@/assets/Geld.png'
import { fetchGerichte, type GerichtCard } from '@/lib/gerichte'
import { INTOLERANCES } from '@/lib/profile'

const TOTAL_STEPS = 11
const DATA_STEP_START = 5

interface OnboardingData {
  firstName: string
  lastName: string
  email: string
  location: string
  intolerances: string[]
  preferenceAlpha: number
  anchorGerichtIds: string[]
  anchorZutaten: string[]
}

const initialData: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  location: '',
  intolerances: [],
  preferenceAlpha: 0.5,
  anchorGerichtIds: [],
  anchorZutaten: [],
}

const KATEGORIE_EMOJI: Record<string, string> = {
  'Frühstück': '🌅',
  'Mittagessen': '☀️',
  'Abendessen': '🌙',
  'Snack': '🍿',
}

/* ─── SVG Icons ─── */

function OverlapIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="40" r="24" fill="#78A75A" fillOpacity="0.3" />
      <circle cx="50" cy="40" r="24" fill="#78A75A" fillOpacity="0.3" />
      <path d="M40 20.7a24 24 0 0 1 0 38.6 24 24 0 0 1 0-38.6z" fill="#78A75A" fillOpacity="0.5" />
    </svg>
  )
}

function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4l3.6 13.4L41 21l-13.4 3.6L24 38l-3.6-13.4L7 21l13.4-3.6L24 4z" fill="#78A75A" />
      <path d="M38 2l1.2 4.8L44 8l-4.8 1.2L38 14l-1.2-4.8L32 8l4.8-1.2L38 2z" fill="#78A75A" fillOpacity="0.5" />
      <path d="M10 34l1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4z" fill="#78A75A" fillOpacity="0.4" />
    </svg>
  )
}

function SavingsIcon({ color = '#78A75A' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>€</text>
    </svg>
  )
}

function ChefHatIcon({ color = '#fff' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18h8v1.5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 018 19.5V18z" fill={color} />
      <path d="M8 18c-1.5 0-3-1.5-3-3.5S6 11 8 11c0-2.5 1.5-4 4-4s4 1.5 4 4c2 0 3 1.5 3 3.5S17.5 18 16 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon({ color = '#78A75A' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l7 3.5v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10v-5L12 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12.5l2.5 2.5L15 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon({ color = '#78A75A' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path d="M12 7v5l3.5 3.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Sub-Components ─── */

function IntroDots({ current }: { current: number }) {
  return (
    <div className="flex gap-2 justify-center mb-6 md:mb-10">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors ${
            i === current ? 'bg-[#78A75A]' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function ProgressBar({ step }: { step: number }) {
  const dataSteps = TOTAL_STEPS - DATA_STEP_START
  return (
    <div className="flex gap-1.5 w-full max-w-xs md:max-w-md mx-auto mb-6 md:mb-10">
      {Array.from({ length: dataSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i <= step ? 'bg-[#78A75A]' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function FeatureCard({ icon, iconBg, title, description, tags, variant = 'default' }: {
  icon: React.ReactNode
  iconBg?: string
  title: string
  description: string
  tags?: string[]
  variant?: 'default' | 'accent' | 'muted'
}) {
  const variants = {
    default: {
      card: 'bg-white border border-gray-200',
      title: 'text-gray-900',
      desc: 'text-gray-500',
      tag: 'bg-[#78A75A]/10 text-[#78A75A]',
    },
    accent: {
      card: 'bg-[#78A75A] border-none',
      title: 'text-white',
      desc: 'text-white/80',
      tag: 'bg-white/20 text-white',
    },
    muted: {
      card: 'bg-gray-100 border-none',
      title: 'text-gray-900',
      desc: 'text-gray-500',
      tag: 'bg-white text-[#78A75A]',
    },
  }
  const v = variants[variant]
  return (
    <div className={`w-full rounded-2xl p-5 md:p-6 ${v.card}`}>
      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4 ${iconBg ?? 'bg-gray-100'}`}>
        {icon}
      </div>
      <h3 className={`text-lg md:text-xl font-bold mb-2 ${v.title}`} style={{ fontFamily: "'Noto Serif', serif" }}>{title}</h3>
      <p className={`text-sm md:text-base leading-relaxed ${v.desc}`}>{description}</p>
      {tags && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span key={tag} className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${v.tag}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ─── */

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [gerichte, setGerichte] = useState<GerichtCard[]>([])
  const [anchorTab, setAnchorTab] = useState<'gerichte' | 'zutaten'>('gerichte')

  useEffect(() => {
    fetchGerichte().then(setGerichte).catch(() => {})
  }, [])

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const toggleIntolerance = (item: string) =>
    setData((d) => ({
      ...d,
      intolerances: d.intolerances.includes(item)
        ? d.intolerances.filter((i) => i !== item)
        : [...d.intolerances, item],
    }))

  const toggleAnchorGericht = (id: string) =>
    setData((d) => ({
      ...d,
      anchorGerichtIds: d.anchorGerichtIds.includes(id)
        ? d.anchorGerichtIds.filter((i) => i !== id)
        : [...d.anchorGerichtIds, id],
    }))

  const toggleAnchorZutat = (name: string) =>
    setData((d) => ({
      ...d,
      anchorZutaten: d.anchorZutaten.includes(name)
        ? d.anchorZutaten.filter((i) => i !== name)
        : [...d.anchorZutaten, name],
    }))

  const handleFinish = () => {
    localStorage.setItem('onboarding_data', JSON.stringify(data))
    onComplete()
  }

  const allZutaten = (() => {
    const freq = new Map<string, number>()
    for (const g of gerichte) {
      for (const z of g.zutaten) {
        freq.set(z.name, (freq.get(z.name) ?? 0) + 1)
      }
    }
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
  })()

  const canProceed = (() => {
    switch (step) {
      case 5:
        return data.firstName.trim() !== '' && data.email.trim() !== ''
      case 8:
        return data.anchorGerichtIds.length > 0 || data.anchorZutaten.length > 0
      default:
        return true
    }
  })()

  const buttonLabel = (() => {
    if (step === 0) return "Los geht's"
    if (step === 4) return 'Jetzt starten'
    if (step === TOTAL_STEPS - 1) return 'Starten'
    return 'Weiter'
  })()

  // Determine if this is an intro step (wider layout on desktop)
  const isIntroStep = step <= 4
  const containerMax = isIntroStep
    ? 'max-w-sm md:max-w-3xl lg:max-w-4xl'
    : 'max-w-sm md:max-w-lg'

  return (
    <div className="h-dvh flex flex-col items-center px-6 pt-10 pb-8 bg-[#f5f7f5] md:pt-16 md:pb-12">
      {/* Intro dot indicator (steps 1-4) */}
      {step >= 1 && step <= 4 && <IntroDots current={step - 1} />}

      {/* Progress bar (data collection steps only) */}
      {step >= DATA_STEP_START && <ProgressBar step={step - DATA_STEP_START} />}

      <div className={`flex-1 flex flex-col items-center justify-center w-full ${containerMax} overflow-y-auto`}>
        {/* ─── Step 0: Willkommen ─── */}
        {step === 0 && (
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 w-full">
            <div className="flex flex-col items-center md:items-start md:flex-1">
              <img src={logo} alt="OverLap Logo" className="w-48 md:w-64 mb-8 mt-8 md:mt-0" />
              <h1
                className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Willkommen bei OverLap
              </h1>
              <p className="mt-3 md:mt-5 text-center md:text-left text-gray-600 md:text-lg lg:text-xl leading-relaxed">
                Plane deine Mahlzeiten smart — mit überlappenden Zutaten sparst du Geld und
                reduzierst Verschwendung.
              </p>
            </div>
            {/* Desktop: decorative overlap circles */}
            <div className="hidden md:flex md:flex-1 items-center justify-center">
              <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-full bg-[#78A75A]/10 -translate-x-8" />
                <div className="absolute inset-0 rounded-full bg-[#78A75A]/10 translate-x-8" />
                <div className="absolute inset-6 rounded-full bg-[#78A75A]/5 flex items-center justify-center">
                  <OverlapIcon className="w-24 h-24 lg:w-32 lg:h-32" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 1: Value Proposition ─── */}
        {step === 1 && (
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 w-full">
            <div className="flex flex-col items-center md:items-start md:flex-1">
              <div className="mt-8 mb-6 md:mt-0 md:mb-8">
                <OverlapIcon className="md:w-[100px] md:h-[100px]" />
              </div>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center md:text-left"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Intelligente Ernährung
              </h1>
              <p className="mt-2 text-lg md:text-xl text-[#78A75A] font-medium text-center md:text-left">
                Dein Gaumen wählt, dein Budget lacht.
              </p>
              <p className="mt-4 text-center md:text-left text-gray-500 md:text-lg leading-relaxed">
                OverLap kombiniert deine kulinarischen Vorlieben mit smarter Budgetplanung —
                ohne Kompromisse beim Geschmack.
              </p>
            </div>
            {/* Desktop: feature highlights as mini-tiles */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-4 md:flex-1">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#ffc791] flex items-center justify-center mb-3">
                  <SavingsIcon color="#874e00" />
                </div>
                <p className="text-sm font-semibold text-gray-800">Geld sparen</p>
                <p className="text-xs text-gray-400 mt-1">Weniger Reste, weniger Kosten</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#78A75A]/10 flex items-center justify-center mb-3">
                  <ChefHatIcon color="#78A75A" />
                </div>
                <p className="text-sm font-semibold text-gray-800">Dein Geschmack</p>
                <p className="text-xs text-gray-400 mt-1">Personalisierte Rezepte</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#c1fd7c] flex items-center justify-center mb-3">
                  <ShieldIcon color="#3c6600" />
                </div>
                <p className="text-sm font-semibold text-gray-800">Allergiefilter</p>
                <p className="text-xs text-gray-400 mt-1">Automatisch sicher</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#78A75A]/10 flex items-center justify-center mb-3">
                  <ClockIcon color="#78A75A" />
                </div>
                <p className="text-sm font-semibold text-gray-800">5 Minuten</p>
                <p className="text-xs text-gray-400 mt-1">Plan für die ganze Woche</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: Ersparnis ─── */}
        {step === 2 && (
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 w-full">
            {/* Desktop: Geld-Bild links */}
            <div className="hidden md:flex md:flex-1 items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-[#78A75A]/5" />
                <img
                  src={geldImg}
                  alt="Geld sparen"
                  className="relative rounded-2xl w-72 lg:w-80 object-cover shadow-lg"
                />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start md:flex-1">
              <div className="mt-8 mb-6 md:mt-0 md:mb-8">
                <SparkleIcon className="md:w-[60px] md:h-[60px]" />
              </div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                Durchschnittliche Ersparnis
              </p>
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#78A75A]">30–50 €</p>
              <p className="text-base md:text-lg text-gray-500 mt-1">pro Woche</p>
              <p className="mt-6 text-center md:text-left text-gray-500 md:text-lg leading-relaxed">
                Unser Algorithmus verteilt Zutaten effizient über die Woche — weniger Reste,
                weniger Kosten.
              </p>
              {/* Mobile: Geld-Bild kleiner unten */}
              <div className="md:hidden mt-6">
                <img
                  src={geldImg}
                  alt="Geld sparen"
                  className="rounded-2xl w-48 object-cover shadow-md mx-auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: Features — Budget + Geschmack ─── */}
        {step === 3 && (
          <>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 text-center"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              So funktioniert's
            </h1>
            <p className="text-gray-500 mb-6 md:mb-10 text-center md:text-lg">
              OverLap plant clever für dich.
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FeatureCard
                icon={<SavingsIcon color="#874e00" />}
                iconBg="bg-[#ffc791]"
                title="Budget-Optimierung"
                description="Der Algorithmus findet die besten Kombinationen und verteilt Zutaten effizient — null Verschwendung."
              />
              <FeatureCard
                icon={<ChefHatIcon color="#fff" />}
                iconBg="bg-white/20"
                title="Maximaler Geschmack"
                description="Inspirierende Rezepte, personalisiert auf deinen Geschmack."
                variant="accent"
              />
            </div>
          </>
        )}

        {/* ─── Step 4: Features — Filter + Zeit ─── */}
        {step === 4 && (
          <>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 text-center"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Einfach & sicher
            </h1>
            <p className="text-gray-500 mb-6 md:mb-10 text-center md:text-lg">
              Für alle Ernährungsformen.
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FeatureCard
                icon={<ShieldIcon color="#3c6600" />}
                iconBg="bg-[#c1fd7c]"
                title="Sorgenfreier Filter"
                description="Allergien und Unverträglichkeiten? Automatische Filterung mit einem Klick."
                tags={['Glutenfrei', 'Vegan', 'Laktosefrei']}
                variant="muted"
              />
              <FeatureCard
                icon={<ClockIcon color="#78A75A" />}
                iconBg="bg-[#78A75A]/10"
                title="Zeit ist die wichtigste Zutat"
                description="In nur 5 Minuten steht dein Plan für die ganze Woche."
              />
            </div>
          </>
        )}

        {/* ─── Step 5: Name & Email ─── */}
        {step === 5 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              Wie heißt du?
            </h1>
            <p className="text-gray-500 mb-6 text-center md:text-lg">Damit wir dich persönlich ansprechen können.</p>
            <div className="w-full space-y-4">
              <div className="md:flex md:gap-4">
                <input
                  type="text"
                  placeholder="Vorname *"
                  value={data.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 md:py-3.5 text-base focus:border-[#78A75A] focus:ring-1 focus:ring-[#78A75A] outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Nachname"
                  value={data.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 md:py-3.5 text-base focus:border-[#78A75A] focus:ring-1 focus:ring-[#78A75A] outline-none bg-white mt-4 md:mt-0"
                />
              </div>
              <input
                type="email"
                placeholder="E-Mail *"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 md:py-3.5 text-base focus:border-[#78A75A] focus:ring-1 focus:ring-[#78A75A] outline-none bg-white"
              />
            </div>
          </div>
        )}

        {/* ─── Step 6: Standort ─── */}
        {step === 6 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              Wo wohnst du?
            </h1>
            <p className="text-gray-500 mb-6 text-center md:text-lg">
              Für passende Supermarkt-Angebote in deiner Nähe.
            </p>
            <input
              type="text"
              placeholder="PLZ oder Ort"
              value={data.location}
              onChange={(e) => update('location', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 md:py-3.5 text-base focus:border-[#78A75A] focus:ring-1 focus:ring-[#78A75A] outline-none bg-white"
            />
            <p className="mt-3 text-sm text-gray-400 text-center">Optional — kannst du auch später angeben.</p>
          </div>
        )}

        {/* ─── Step 7: Unverträglichkeiten ─── */}
        {step === 7 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              Unverträglichkeiten
            </h1>
            <p className="text-gray-500 mb-6 text-center md:text-lg">
              Wähle aus, was du nicht essen kannst oder möchtest.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3 w-full justify-center md:max-w-md">
              {INTOLERANCES.map((item) => {
                const selected = data.intolerances.includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggleIntolerance(item)}
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-medium border transition-colors ${
                      selected
                        ? 'bg-[#78A75A] text-white border-[#78A75A]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#78A75A]'
                    }`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
            <p className="mt-4 text-sm text-gray-400 text-center">Optional — du kannst das später im Profil ändern.</p>
          </div>
        )}

        {/* ─── Step 8: Anker-Gerichte & Zutaten ─── */}
        {step === 8 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              Deine Favoriten
            </h1>
            <p className="text-gray-500 mb-4 text-center md:text-lg">
              Wähle Gerichte oder Zutaten, die du liebst. Darauf basieren deine ersten Vorschläge.
            </p>

            {/* Tab switcher */}
            <div className="flex w-full md:max-w-xs bg-gray-100 rounded-xl p-1 mb-4">
              <button
                onClick={() => setAnchorTab('gerichte')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  anchorTab === 'gerichte'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Gerichte
              </button>
              <button
                onClick={() => setAnchorTab('zutaten')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  anchorTab === 'zutaten'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Zutaten
              </button>
            </div>

            {/* Selection count */}
            {(data.anchorGerichtIds.length > 0 || data.anchorZutaten.length > 0) && (
              <div className="w-full mb-3 px-3 py-2 bg-[#78A75A]/10 rounded-lg text-sm text-[#78A75A] font-medium">
                {data.anchorGerichtIds.length > 0 && `${data.anchorGerichtIds.length} Gericht${data.anchorGerichtIds.length > 1 ? 'e' : ''}`}
                {data.anchorGerichtIds.length > 0 && data.anchorZutaten.length > 0 && ' + '}
                {data.anchorZutaten.length > 0 && `${data.anchorZutaten.length} Zutat${data.anchorZutaten.length > 1 ? 'en' : ''}`}
                {' '}als Anker gewählt
              </div>
            )}

            {anchorTab === 'gerichte' ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 overflow-y-auto max-h-[40vh]">
                {gerichte.map((g) => {
                  const selected = data.anchorGerichtIds.includes(g.id)
                  const emoji = KATEGORIE_EMOJI[g.kategorie] ?? '🍽️'
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleAnchorGericht(g.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        selected
                          ? 'border-[#78A75A] bg-[#78A75A]/5 ring-1 ring-[#78A75A]/20'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{g.name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {g.zutaten.slice(0, 3).map((z) => z.name).join(', ')}
                          {g.zutaten.length > 3 && ` +${g.zutaten.length - 3}`}
                        </p>
                      </div>
                      {selected && (
                        <div className="w-5 h-5 rounded-full bg-[#78A75A] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="w-full flex flex-wrap gap-2 overflow-y-auto max-h-[40vh] justify-center">
                {allZutaten.map((name) => {
                  const selected = data.anchorZutaten.includes(name)
                  return (
                    <button
                      key={name}
                      onClick={() => toggleAnchorZutat(name)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        selected
                          ? 'bg-[#78A75A] text-white border-[#78A75A]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#78A75A]'
                      }`}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
            )}

            <p className="mt-3 text-xs text-gray-400 text-center">
              Mindestens 1 Gericht oder Zutat wählen. Je mehr, desto bessere Vorschläge!
            </p>
          </div>
        )}

        {/* ─── Step 9: Präferenz-Slider ─── */}
        {step === 9 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              Deine Präferenz
            </h1>
            <p className="text-gray-500 mb-8 text-center md:text-lg">
              Was ist dir wichtiger beim Planen?
            </p>
            <div className="w-full space-y-4">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={data.preferenceAlpha}
                onChange={(e) => update('preferenceAlpha', parseFloat(e.target.value))}
                className="w-full accent-[#78A75A]"
              />
              <div className="flex justify-between text-sm md:text-base">
                <span className={data.preferenceAlpha < 0.4 ? 'font-semibold text-[#78A75A]' : 'text-gray-500'}>
                  Geschmacksvielfalt
                </span>
                <span className={data.preferenceAlpha > 0.6 ? 'font-semibold text-[#78A75A]' : 'text-gray-500'}>
                  Kostenersparnis
                </span>
              </div>
              <p className="text-center text-sm md:text-base text-gray-400">
                {data.preferenceAlpha < 0.35
                  ? 'Du bekommst möglichst abwechslungsreiche Gerichte.'
                  : data.preferenceAlpha > 0.65
                    ? 'Gerichte teilen sich viele Zutaten — weniger Einkauf, weniger Reste.'
                    : 'Ein ausgewogener Mix aus Vielfalt und Effizienz.'}
              </p>
            </div>
          </div>
        )}

        {/* ─── Step 10: Zusammenfassung ─── */}
        {step === 10 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              Alles klar!
            </h1>
            <p className="text-gray-500 mb-6 text-center md:text-lg">Hier deine Angaben auf einen Blick.</p>
            <div className="w-full space-y-3 rounded-2xl bg-white p-5 md:p-6 text-sm md:text-base shadow-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">{data.firstName} {data.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">E-Mail</span>
                <span className="font-medium">{data.email}</span>
              </div>
              {data.location && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Standort</span>
                  <span className="font-medium">{data.location}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Unverträglichkeiten</span>
                <span className="font-medium">{data.intolerances.length > 0 ? data.intolerances.join(', ') : 'Keine'}</span>
              </div>
              <div>
                <span className="text-gray-500">Anker</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {data.anchorGerichtIds.map((id) => {
                    const g = gerichte.find((g) => g.id === id)
                    return g ? (
                      <span key={id} className="text-xs px-2 py-1 rounded-full bg-[#78A75A]/10 text-[#78A75A] font-medium">
                        {g.name}
                      </span>
                    ) : null
                  })}
                  {data.anchorZutaten.map((name) => (
                    <span key={name} className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Präferenz</span>
                <span className="font-medium">
                  {data.preferenceAlpha < 0.35
                    ? 'Vielfalt'
                    : data.preferenceAlpha > 0.65
                      ? 'Kostenersparnis'
                      : 'Ausgewogen'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={`w-full mt-8 flex gap-3 ${isIntroStep ? 'max-w-sm md:max-w-md' : 'max-w-sm md:max-w-lg'}`}>
        {step > 0 && (
          <button
            onClick={back}
            className="flex-1 rounded-xl border border-gray-300 px-6 py-3 md:py-3.5 text-base font-semibold text-gray-700 active:scale-95 transition-transform bg-white"
          >
            Zurück
          </button>
        )}
        <button
          onClick={step === TOTAL_STEPS - 1 ? handleFinish : next}
          disabled={!canProceed}
          className={`flex-1 rounded-xl px-6 py-3 md:py-3.5 text-base font-semibold text-white shadow-md active:scale-95 transition-transform ${
            canProceed ? 'bg-[#78A75A]' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
