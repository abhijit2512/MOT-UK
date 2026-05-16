import { NavLink, Link } from 'react-router-dom';
import { Car, Search, Tag, LayoutDashboard } from 'lucide-react';

const links = [
  { to: '/mot', label: 'MOT Check', icon: Search },
  { to: '/sell', label: 'Sell', icon: Tag },
  { to: '/browse', label: 'Browse', icon: Car },
  { to: '/admin', label: 'Admin', icon: LayoutDashboard },
];

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Car size={18} />
          </span>
          <span>MOTMate UK</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
