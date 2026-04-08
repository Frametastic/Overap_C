export const INTOLERANCES = [
  'Laktose',
  'Gluten',
  'Nüsse',
  'Meeresfrüchte',
  'Eier',
  'Soja',
  'Sellerie',
  'Senf',
  'Sesam',
  'Vegetarisch',
  'Vegan',
] as const

export interface ProfileData {
  firstName: string
  lastName: string
  email: string
  location: string
  intolerances: string[]
  preferenceAlpha: number
  anchorGerichtIds: string[]
  anchorZutaten: string[]
  age?: number
  gender?: string
  dislikes: string[]
  notifications: {
    wochenplanReminder: boolean
    einkaufsliste: boolean
  }
}

const PROFILE_KEY = 'profile_data'
const ONBOARDING_KEY = 'onboarding_data'

const DEFAULT_EXTENSIONS = {
  dislikes: [] as string[],
  notifications: {
    wochenplanReminder: false,
    einkaufsliste: false,
  },
}

export function loadProfile(): ProfileData | null {
  const profileRaw = localStorage.getItem(PROFILE_KEY)
  if (profileRaw) {
    const parsed = JSON.parse(profileRaw)
    return { ...DEFAULT_EXTENSIONS, ...parsed }
  }

  const onboardingRaw = localStorage.getItem(ONBOARDING_KEY)
  if (onboardingRaw) {
    const parsed = JSON.parse(onboardingRaw)
    return { ...DEFAULT_EXTENSIONS, ...parsed }
  }

  return null
}

export function saveProfile(data: ProfileData): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data))

  // Sync relevant fields back to onboarding_data so Entdecken keeps working
  const onboardingRaw = localStorage.getItem(ONBOARDING_KEY)
  if (onboardingRaw) {
    const onboarding = JSON.parse(onboardingRaw)
    onboarding.firstName = data.firstName
    onboarding.lastName = data.lastName
    onboarding.email = data.email
    onboarding.location = data.location
    onboarding.intolerances = data.intolerances
    onboarding.preferenceAlpha = data.preferenceAlpha
    onboarding.anchorGerichtIds = data.anchorGerichtIds
    onboarding.anchorZutaten = data.anchorZutaten
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(onboarding))
  }
}
