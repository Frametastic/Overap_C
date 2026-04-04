import { BrowserRouter, Routes, Route, NavLink } from 'react-router'
import Onboarding from '@/pages/Onboarding'
import Wochenplan from '@/pages/Wochenplan'
import Einkaufsliste from '@/pages/Einkaufsliste'
import Profil from '@/pages/Profil'

const navItems = [
  { to: '/', label: 'Start' },
  { to: '/wochenplan', label: 'Wochenplan' },
  { to: '/einkaufsliste', label: 'Einkaufsliste' },
  { to: '/profil', label: 'Profil' },
] as const

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/wochenplan" element={<Wochenplan />} />
            <Route path="/einkaufsliste" element={<Einkaufsliste />} />
            <Route path="/profil" element={<Profil />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </BrowserRouter>
  )
}
