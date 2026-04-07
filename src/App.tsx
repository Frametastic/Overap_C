import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router'
import { useState } from 'react'
import { MealPlanProvider, useMealPlan } from '@/context/MealPlanContext'
import Onboarding from '@/pages/Onboarding'
import Entdecken from '@/pages/Entdecken'
import Wochenplan from '@/pages/Wochenplan'
import Einkaufsliste from '@/pages/Einkaufsliste'
import Profil from '@/pages/Profil'

const MIN_GERICHTE = 3

export default function App() {
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem('onboarding_completed') === 'true',
  )

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setOnboarded(true)
  }

  if (!onboarded) {
    return (
      <BrowserRouter>
        <Onboarding onComplete={completeOnboarding} />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <MealPlanProvider>
        <AppShell />
      </MealPlanProvider>
    </BrowserRouter>
  )
}

function AppShell() {
  const { selected } = useMealPlan()
  const canAccessPlan = selected.length >= MIN_GERICHTE

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<Entdecken />} />
          <Route
            path="/wochenplan"
            element={canAccessPlan ? <Wochenplan /> : <Navigate to="/" replace />}
          />
          <Route path="/einkaufsliste" element={<Einkaufsliste />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'text-[#78A75A] bg-[#78A75A]/10'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            Entdecken
          </NavLink>

          {canAccessPlan ? (
            <NavLink
              to="/wochenplan"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg relative ${
                  isActive
                    ? 'text-[#78A75A] bg-[#78A75A]/10'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Plan
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#78A75A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {selected.length}
              </span>
            </NavLink>
          ) : (
            <span className="px-3 py-2 text-sm font-medium rounded-lg text-gray-300 cursor-not-allowed" title={`Wähle mindestens ${MIN_GERICHTE} Gerichte`}>
              Plan
            </span>
          )}

          <NavLink
            to="/einkaufsliste"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'text-[#78A75A] bg-[#78A75A]/10'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            Einkauf
          </NavLink>

          <NavLink
            to="/profil"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'text-[#78A75A] bg-[#78A75A]/10'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            Profil
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
