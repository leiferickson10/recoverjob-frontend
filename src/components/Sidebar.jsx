import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leads', label: 'Leads' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <aside className="w-52 flex flex-col h-full bg-brand-navy text-white">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="RecoverJob"
          className="h-10 w-auto"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="font-bold text-lg tracking-tight">RecoverJob</span>
      </div>
      <nav className="flex flex-col gap-1 p-4 flex-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-green text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 rounded text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
