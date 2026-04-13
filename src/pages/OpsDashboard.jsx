import React from 'react';
import { useDemoState } from '../utils/demoState';
import crowdZones from '../data/crowdData.json';

const phases = ['Pre-Match', 'First Half', 'Halftime', 'Second Half', 'Post-Match'];

export default function OpsDashboard() {
  const [demoState, updateDemoState] = useDemoState();
  const { phase, isEmergency, emergencyType } = demoState;

  const handleTriggerEmergency = (type) => {
    updateDemoState({ isEmergency: true, emergencyType: type });
  };

  const clearEmergency = () => {
    updateDemoState({ isEmergency: false, emergencyType: null });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-12 pt-6">
      <header>
        <p className="section-label text-xs font-semibold uppercase text-sky-400">Venue Control Center</p>
        <h1 className="mt-2 font-display text-4xl uppercase text-white md:text-5xl">Operations Dashboard</h1>
      </header>

      {isEmergency && (
        <section className="animate-pulse rounded-[2rem] border-2 border-red-500 bg-red-500/20 p-6 shadow-[0_0_40px_rgba(239,68,68,0.4)]">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-red-100">
            🚨 ACTIVE EMERGENCY: {emergencyType}
          </h2>
          <p className="mt-4 text-red-200">
            All attendee devices have been forced into evacuation mode and locked to the safest nearest exits.
          </p>
          <button
            onClick={clearEmergency}
            className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-red-600 transition hover:bg-red-50"
          >
            Resolve Emergency (Restore Normal Flow)
          </button>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <article className="glass-card rounded-[2rem] border-white/10 bg-white/5 p-6 shadow-glow">
          <h3 className="section-label text-xs font-semibold uppercase text-slate-300">Phase Controls (Demo Sync)</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {phases.map((p) => (
              <button
                key={p}
                disabled={isEmergency}
                onClick={() => updateDemoState({ phase: p })}
                className={`rounded-[1.25rem] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] transition ${
                  phase === p && !isEmergency
                    ? 'border-2 border-lime-300/50 bg-lime-300 text-slate-950 shadow-[0_0_20px_rgba(190,242,100,0.3)]'
                    : 'border border-white/10 bg-slate-950 text-slate-300 hover:bg-white/10'
                } ${isEmergency ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Changing the phase here immediately updates the AI predictions in all connected attendee devices.
          </p>
        </article>

        <article className="glass-card rounded-[2rem] border-white/10 bg-white/5 p-6 shadow-glow">
          <h3 className="section-label flex items-center gap-2 text-xs font-semibold uppercase text-rose-300">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            Critical Overrides
          </h3>
          <div className="mt-6 grid gap-4">
            <button
              onClick={() => handleTriggerEmergency('Fire Alarm')}
              disabled={isEmergency}
              className="group relative overflow-hidden rounded-[1.25rem] border border-red-500/30 bg-red-950/60 p-4 text-left transition hover:bg-red-900/80 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              <h4 className="text-lg font-bold uppercase text-red-200">🔥 Trigger Fire Alarm</h4>
              <p className="mt-1 text-xs text-red-300/70">Initiates immediate zone-based evacuation routing.</p>
            </button>
            
            <button
              onClick={() => handleTriggerEmergency('Security Incident')}
              disabled={isEmergency}
              className="group relative overflow-hidden rounded-[1.25rem] border border-amber-500/30 bg-amber-950/60 p-4 text-left transition hover:bg-amber-900/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <h4 className="text-lg font-bold uppercase text-amber-200">🛡️ Trigger Security Incident</h4>
              <p className="mt-1 text-xs text-amber-300/70">Forces mass egress and blocks movement towards concourse.</p>
            </button>
          </div>
        </article>
      </section>

      <section className="glass-card rounded-[2rem] border-white/10 bg-black/40 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold uppercase tracking-widest text-white">Live Operations Map [Mock View]</h3>
          <span className="rounded-full bg-lime-400/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-lime-300">Online</span>
        </div>
        
        {/* A simple visualization table to give a "Dashboard" feel in the demo */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {crowdZones.slice(0, 8).map(zone => (
              <div key={zone.zone} className="rounded-xl border border-white/5 bg-white/5 p-4">
                 <p className="text-xs uppercase tracking-wider text-slate-400">{zone.zone}</p>
                 <p className="mt-2 text-2xl font-bold text-white">{zone.people} <span className="text-sm font-normal text-slate-500">PAX</span></p>
                 {isEmergency ? (
                    <div className="mt-2 text-[10px] font-bold text-red-400 uppercase">Evacuating</div>
                 ) : (
                    <div className="mt-2 text-[10px] uppercase text-sky-400">Normal Flow</div>
                 )}
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
