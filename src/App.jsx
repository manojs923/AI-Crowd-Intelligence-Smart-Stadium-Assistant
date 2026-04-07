import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-900">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.18),_transparent_24%),linear-gradient(180deg,_#fffaf2_0%,_#f8fbff_48%,_#eff6ff_100%)]" />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="font-display text-lg font-semibold tracking-wide text-slate-950">
            Smart Stadium AI
          </p>
          <p className="text-sm text-slate-600">Crowd intelligence for safer events</p>
        </div>
        <nav className="flex items-center gap-3 rounded-full border border-white/70 bg-white/70 p-2 shadow-glow backdrop-blur">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
