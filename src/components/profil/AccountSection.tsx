import type { ProfileData } from '@/lib/profile'

interface Props {
  profile: ProfileData
}

function DisabledRow({ label, value, hint }: { label: string; value?: string; hint: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 opacity-50">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {value && <p className="text-sm text-gray-500">{value}</p>}
      </div>
      <span className="text-xs text-gray-400">{hint}</span>
    </div>
  )
}

export default function AccountSection({ profile }: Props) {
  const hint = 'Kommt mit Konto'

  return (
    <div>
      <DisabledRow label="E-Mail-Adresse" value={profile.email || 'Nicht angegeben'} hint={hint} />
      <DisabledRow label="Passwort ändern" hint={hint} />
      <DisabledRow label="Konto löschen" hint={hint} />
    </div>
  )
}
