import type { ProfileData } from '@/lib/profile'

interface Props {
  profile: ProfileData
  onChange: (updates: Partial<ProfileData>) => void
}

export default function ProfileHeader({ profile, onChange }: Props) {
  const initials = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('')

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
        style={{ backgroundColor: '#78A75A', fontFamily: "'Noto Serif', serif" }}
      >
        {initials || '?'}
      </div>
      <div className="flex gap-3 w-full max-w-sm">
        <input
          type="text"
          value={profile.firstName}
          onChange={e => onChange({ firstName: e.target.value })}
          placeholder="Vorname"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#78A75A] focus:border-transparent"
        />
        <input
          type="text"
          value={profile.lastName}
          onChange={e => onChange({ lastName: e.target.value })}
          placeholder="Nachname"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#78A75A] focus:border-transparent"
        />
      </div>
    </div>
  )
}
