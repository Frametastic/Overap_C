import type { ProfileData } from '@/lib/profile'

interface Props {
  profile: ProfileData
  onChange: (updates: Partial<ProfileData>) => void
}

function Toggle({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-[#78A75A]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  )
}

export default function NotificationSettings({ profile, onChange }: Props) {
  const toggle = (key: keyof ProfileData['notifications']) => {
    onChange({
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key],
      },
    })
  }

  return (
    <div>
      <Toggle
        label="Wochenplan-Erinnerung"
        checked={profile.notifications.wochenplanReminder}
        onToggle={() => toggle('wochenplanReminder')}
      />
      <Toggle
        label="Einkaufsliste"
        checked={profile.notifications.einkaufsliste}
        onToggle={() => toggle('einkaufsliste')}
      />
      <p className="text-xs text-gray-400 mt-3">
        Push-Benachrichtigungen kommen mit der mobilen App.
      </p>
    </div>
  )
}
