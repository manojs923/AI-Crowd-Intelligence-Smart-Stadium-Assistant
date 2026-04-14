import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Entry({ userProfile, onStart }) {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState('idle'); // idle, connecting, fetching, success
  
  // If user already has profile and hits Entry, usually they just resume, but we let them scan again.
  // Actually, we can just let them scan.

  useEffect(() => {
    if (scanState === 'connecting') {
      const timer = window.setTimeout(() => setScanState('fetching'), 600);
      return () => window.clearTimeout(timer);
    }
    if (scanState === 'fetching') {
      const timer = window.setTimeout(() => setScanState('success'), 600);
      return () => window.clearTimeout(timer);
    }
    if (scanState === 'success') {
      const timer = window.setTimeout(() => {
        onStart({
          gate: 'South Gate',
          seat: 'Section B, Row 5, Seat B12',
          goal: 'seat',
          goalLabel: 'Watch match',
        });
        navigate('/dashboard');
      }, 1000);
      return () => window.clearTimeout(timer);
    }
  }, [scanState, navigate, onStart]);

  const handleScan = () => {
    setScanState('connecting');
  };

  return (
    <div className="space-y-6 pb-8 pt-2">
      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="stadium-panel rounded-[2rem] p-6 md:p-8">
          <p className="section-label text-xs font-semibold uppercase text-sky-300">
            Fan Onboarding
          </p>
          <h1 className="mt-4 font-display text-6xl uppercase leading-[0.92] text-white md:text-7xl">
            Seamless Stadium Access.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-300">
            Simulate a real-world entry. Scanning your digital match ticket automatically injects your seating and gate data into the Live Matchday Radar.
          </p>
        </div>

        <div className="glass-card rounded-[2rem] border-white/10 bg-white/5 p-6 md:p-12 flex flex-col items-center justify-center min-h-[400px]">
          {scanState === 'idle' && (
            <div className="text-center w-full">
              <div className="mx-auto mb-8 h-24 w-24 rounded-[2rem] border-2 border-dashed border-sky-400/50 flex items-center justify-center bg-sky-400/10">
                <span className="text-4xl">📱</span>
              </div>
              <button
                type="button"
                onClick={handleScan}
                className="w-full max-w-sm rounded-[1.35rem] bg-lime-300 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:-translate-y-0.5 shadow-neon"
              >
                [ Scan Match Ticket ]
              </button>
            </div>
          )}

          {scanState !== 'idle' && (
            <div className="w-full max-w-md space-y-4 font-mono text-sm sm:text-base">
              <div className={`p-4 rounded-xl border ${scanState !== 'idle' ? 'border-sky-400/30 bg-sky-400/10 text-sky-300' : 'border-white/10 text-slate-500'}`}>
                🔄 Connecting to ticket system...
              </div>
              
              <div className={`p-4 rounded-xl border transition-all duration-300 ${['fetching', 'success'].includes(scanState) ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' : 'border-white/5 text-slate-600 opacity-50'}`}>
                {['fetching', 'success'].includes(scanState) ? '📡 Fetching seat details...' : 'Waiting...'}
              </div>

              <div className={`p-4 rounded-xl border transition-all duration-300 ${scanState === 'success' ? 'border-lime-400/30 bg-lime-400/10 text-lime-300 shadow-neon' : 'border-white/5 text-slate-600 opacity-50'}`}>
                {scanState === 'success' ? '✅ Seat detected' : 'Waiting...'}
              </div>

              {scanState === 'success' && (
                <div className="mt-8 text-center animate-fade-in">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Profile Auto-Filled</p>
                  <p className="text-lg font-bold text-white rounded-full bg-white/10 px-4 py-2 inline-block">
                    South Gate | Section B | Row 5 | Seat B12
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
