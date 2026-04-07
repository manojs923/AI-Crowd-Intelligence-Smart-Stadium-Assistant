import { getCrowdColor, getCrowdLevel, getCrowdTextColor, getPhaseTheme } from '../utils/prediction';

export default function Heatmap({ zones, phase }) {
  const theme = getPhaseTheme(phase);

  return (
    <section className="glass-card rounded-[28px] p-6 shadow-glow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${theme.accent}`}>
            Crowd Heatmap
          </p>
          <h2 className="font-display text-2xl font-bold text-slate-950">
            Live zone pressure
          </h2>
        </div>
        <div className="flex gap-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            High
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            Medium
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Low
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className={`relative min-h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br ${theme.surface} p-4`}>
          <div className="absolute inset-8 rounded-full border border-dashed border-slate-300/80" />
          <div className="absolute inset-[22%] rounded-full border border-dashed border-slate-300/60" />
          <div className="absolute left-8 top-6 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white shadow-lg">
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
                    isHigh ? 'heatmap-surge opacity-35' : 'opacity-20'
                  }`}
                />
                <div
                  className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${getCrowdColor(
                    level,
                  )} ring-4 ring-white`}
                />
                <div className="mt-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                  {zone.zone}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {zones.map((zone) => {
            const level = getCrowdLevel(zone.people);
            return (
              <div
                key={zone.zone}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{zone.zone}</h3>
                    <p className="text-sm text-slate-500">{zone.people} people detected</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getCrowdTextColor(
                      level,
                    )} bg-white`}
                  >
                    {level}
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
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
