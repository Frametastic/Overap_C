import { INTOLERANCES, type ProfileData } from '@/lib/profile'

interface Props {
  profile: ProfileData
  onChange: (updates: Partial<ProfileData>) => void
}

export default function DietaryPreferences({ profile, onChange }: Props) {
  const toggleIntolerance = (item: string) => {
    const current = profile.intolerances
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    onChange({ intolerances: updated })
  }

  return (
    <div className="space-y-5">
      {/* Intoleranzen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Unverträglichkeiten & Ernährung
        </label>
        <div className="flex flex-wrap gap-2">
          {INTOLERANCES.map(item => {
            const active = profile.intolerances.includes(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleIntolerance(item)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#78A75A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lieblings-Zutaten */}
      {profile.anchorZutaten.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lieblingszutaten
          </label>
          <div className="flex flex-wrap gap-2">
            {profile.anchorZutaten.map(zutat => (
              <span
                key={zutat}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-[#78A75A]/10 text-[#78A75A]"
              >
                {zutat}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      anchorZutaten: profile.anchorZutaten.filter(z => z !== zutat),
                    })
                  }
                  className="ml-1 text-[#78A75A]/60 hover:text-[#78A75A]"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
