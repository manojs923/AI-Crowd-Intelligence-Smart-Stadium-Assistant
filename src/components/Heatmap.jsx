import { getCrowdColor, getCrowdLevel, getCrowdTextColor, getPhaseTheme } from '../utils/prediction';

export default function Heatmap({ zones, phase }) {
  const theme = getPhaseTheme(phase);

  return (
    <section className={`glass-card rounded-[1.75rem] border-white/10 bg-white/5 p-5 ${theme.border}`}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className={`section-label text-[11px] font-semibold uppercase ${theme.accent}`}>
            Crowd Heatmap
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase leading-none text-white">
            Live zone pressure
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            High
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            Medium
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
            Low
          </span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.06fr_0.94fr]">
        <div className={`pitch-lines relative min-h-[320px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${theme.surface} p-4`}>
          <div className="absolute inset-4 rounded-[1.25rem] border border-white/15" />
          <div className="absolute inset-y-[18%] left-1/2 w-px -translate-x-1/2 bg-white/15" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
          <div className="absolute left-6 top-5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg">
            Live pulse map
          </div>
          {zones.map((zone) => {
            const level = getCrowdLevel(zone.people);
            const isHigh = level === 'High';
            return (
              <div
                key={zone.zone}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              >
                <div
                  className={`pulse-dot h-16 w-16 rounded-full ${getCrowdColor(level)} ${
                    isHigh ? 'heatmap-surge opacity-30' : 'opacity-20'
                  }`}
                />
                <div
                  className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${getCrowdColor(
                    level,
                  )} ring-4 ring-slate-950/60`}
                />
                <div className="mt-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow">
                  {zone.zone}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {zones.map((zone) => {
            const level = getCrowdLevel(zone.people);
            return (
              <div
                key={zone.zone}
                className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4 transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold uppercase tracking-[0.08em] text-white">{zone.zone}</h3>
                    <p className="text-sm text-slate-400">{zone.people} people detected</p>
                  </div>
                  <span className={`rounded-full bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${getCrowdTextColor(level)}`}>
                    {level}
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getCrowdColor(level)}`}
                    style={{ width: `${Math.min(zone.people, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
