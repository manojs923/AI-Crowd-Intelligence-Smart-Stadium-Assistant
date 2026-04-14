import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Entry from './pages/Entry';
import OpsDashboard from './pages/OpsDashboard';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/entry', label: 'Entry' },
  { to: '/dashboard', label: 'Dashboard' },
];

function loadProfile() {
  if (typeof window === 'undefined') return null;

  try {
    const saved = window.localStorage.getItem('stadium-profile');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [userProfile, setUserProfile] = useState(loadProfile);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (userProfile) {
      window.localStorage.setItem('stadium-profile', JSON.stringify(userProfile));
      return;
    }

    window.localStorage.removeItem('stadium-profile');
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_22%),radial-gradient(circle_at_82%_12%,_rgba(139,92,246,0.16),_transparent_18%),linear-gradient(180deg,_rgba(3,7,12,0.96)_0%,_rgba(1,2,4,0.99)_100%)]" />
        <div className="signal-grid absolute inset-x-0 top-0 h-[28rem] opacity-20" />
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="min-w-0">
            <p className="section-label text-[10px] font-semibold uppercase text-lime-300">
              Matchday Navigator
            </p>
            <p className="font-display text-3xl leading-none text-white md:text-4xl">
              Smart Stadium AI
            </p>
            <p className="text-xs text-slate-300 md:text-sm">
              Live routing, queue control, and fan coordination
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userProfile ? (
              <div className="hidden rounded-full border border-lime-300/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 shadow-neon md:block">
                {userProfile.gate} | {userProfile.seat} | {userProfile.goalLabel}
              </div>
            ) : null}
            
            <NavLink
              to="/ops"
              target="_blank"
              className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 transition hover:bg-white/10 hover:text-white md:px-4 md:py-2 md:text-xs"
            >
              Staff portal
            </NavLink>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-4 md:px-6">
          <nav className="grid grid-cols-3 gap-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-2 shadow-glow">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-[1rem] px-3 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] transition ${
                    isActive
                      ? 'bg-lime-300 text-slate-950 shadow-neon'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 md:px-6 md:pb-14">
        <Routes>
          <Route path="/" element={<Home userProfile={userProfile} />} />
          <Route
            path="/entry"
            element={<Entry userProfile={userProfile} onStart={setUserProfile} />}
          />
          <Route
            path="/dashboard"
            element={
              userProfile ? (
                <Dashboard userProfile={userProfile} onResetExperience={() => setUserProfile(null)} />
              ) : (
                <Navigate to="/entry" replace />
              )
            }
          />
          <Route path="/ops" element={<OpsDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
