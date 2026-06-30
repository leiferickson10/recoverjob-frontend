import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leads', label: 'Leads' },
  { to: '/settings', label: 'Settings' },
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="RecoverJob"
                className="h-10 w-auto"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="font-bold text-[#1B2F5E] text-lg tracking-tight">RecoverJob</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors pb-0.5 ${
                      isActive
                        ? 'text-[#1B2F5E] border-b-2 border-[#4CAF29]'
                        : 'text-gray-500 hover:text-[#1B2F5E]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-[#1B2F5E] text-white hover:bg-[#152549] transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-[#1B2F5E] hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1B2F5E]/10 text-[#1B2F5E]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#1B2F5E]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="mt-2 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#1B2F5E] hover:bg-[#152549] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
