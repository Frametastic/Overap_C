import { useState, useEffect, useCallback } from 'react'
import { loadProfile, saveProfile, type ProfileData } from '@/lib/profile'
import ProfilSection from '@/components/profil/ProfilSection'
import ProfileHeader from '@/components/profil/ProfileHeader'
import DietaryPreferences from '@/components/profil/DietaryPreferences'
import AccountSection from '@/components/profil/AccountSection'
import NotificationSettings from '@/components/profil/NotificationSettings'

const GENDER_OPTIONS = [
  { value: '', label: 'Keine Angabe' },
  { value: 'weiblich', label: 'Weiblich' },
  { value: 'männlich', label: 'Männlich' },
  { value: 'divers', label: 'Divers' },
]

export default function Profil() {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    setProfile(loadProfile())
  }, [])

  const handleChange = useCallback((updates: Partial<ProfileData>) => {
    setProfile(prev => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      saveProfile(next)
      return next
    })
  }, [])

  if (!profile) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Bitte schließe zuerst das Onboarding ab.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-2 pb-20 max-w-lg mx-auto space-y-4">
      <ProfileHeader profile={profile} onChange={handleChange} />

      <ProfilSection title="Persönliche Daten">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Standort</label>
            <input
              type="text"
              value={profile.location}
              onChange={e => handleChange({ location: e.target.value })}
              placeholder="PLZ oder Stadt"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#78A75A] focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alter</label>
              <input
                type="number"
                value={profile.age ?? ''}
                onChange={e => handleChange({ age: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Optional"
                min={1}
                max={120}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#78A75A] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Geschlecht</label>
              <select
                value={profile.gender ?? ''}
                onChange={e => handleChange({ gender: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#78A75A] focus:border-transparent bg-white"
              >
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </ProfilSection>

      <ProfilSection title="Ernährung & Unverträglichkeiten">
        <DietaryPreferences profile={profile} onChange={handleChange} />
      </ProfilSection>

      <ProfilSection title="Konto & Sicherheit" defaultOpen={false}>
        <AccountSection profile={profile} />
      </ProfilSection>

      <ProfilSection title="Benachrichtigungen" defaultOpen={false}>
        <NotificationSettings profile={profile} onChange={handleChange} />
      </ProfilSection>

      <ProfilSection title="App-Info" defaultOpen={false}>
        <div className="text-sm text-gray-500">
          <p>MealOverlap v1.0 MVP</p>
        </div>
      </ProfilSection>
    </div>
  )
}
