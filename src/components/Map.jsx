import { useEffect, useState } from 'react';
import { getBestRoute } from '../utils/routing';
import { getCrowdLevel } from '../utils/prediction';

const destinations = [
  { key: 'seat', label: 'My Seat' },
  { key: 'food', label: 'Food Stall' },
  { key: 'washroom', label: 'Washroom' },
  { key: 'exit', label: 'Fastest Exit' },
];

export default function Map({ crowdZones, destination, onDestinationChange, userProfile }) {
  const route = getBestRoute(destination, crowdZones, userProfile);
  const [selectedZone, setSelectedZone] = useState(crowdZones[0]?.zone ?? 'North Gate');

  useEffect(() => {
    setSelectedZone(route.recommendedZone);
  }, [route.recommendedZone]);

  const activeZone = crowdZones.find((zone) => zone.zone === selectedZone) ?? crowdZones[0];
  const zoneWait = Math.max(2, Math.round((activeZone?.waitFactor ?? 1) * 10));
  const zoneRecommendation =
    getCrowdLevel(activeZone?.people ?? 0) === 'High' ? 'Avoid for now' : 'Good path to use';

  return (
    <section className="glass-card rounded-[28px] p-6 shadow-glow">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
            Smart Navigation
          </p>
          <h2 className="font-display text-2xl font-bold text-slate-950">
            Least crowded route guidance
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Starting from {userProfile.gate}, optimized for {userProfile.seat} and {userProfile.goalLabel.toLowerCase()}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {destinations.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onDestinationChange(item.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                destination === item.key
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white">
          <div className="grid gap-3 sm:grid-cols-2">
            {crowdZones.map((spot, index) => {
              const isActive = activeZone?.zone === spot.zone;
              const level = getCrowdLevel(spot.people);

              return (
                <button
                  key={spot.zone}
                  type="button"
                  onClick={() => setSelectedZone(spot.zone)}
                  className={`rounded-2xl border p-4 text-left transition duration-300 ${
                    isActive
                      ? 'border-sky-300 bg-sky-500/20 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10'
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Zone {index + 1}</p>
                  <p className="mt-2 font-semibold">{spot.zone}</p>
                  <p className="mt-1 text-sm text-slate-300">Crowd: {level}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-2xl bg-white/8 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Recommended zone</p>
            <p className="mt-2 text-xl font-bold">{route.recommendedZone}</p>
            <p className="mt-1 text-sm text-slate-300">
              Current local crowd level: {route.crowdLevel}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5">
            <h3 className="font-display text-xl font-bold text-slate-950">{route.title}</h3>
            <p className="mt-2 text-sm text-slate-600">
              The route below avoids the busiest paths and favors smoother movement.
            </p>
            <div className="mt-4 space-y-3">
              {route.steps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm font-medium text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Zone Insight</p>
            <h3 className="mt-2 text-2xl font-bold">{activeZone?.zone}</h3>
            <p className="mt-4 text-sm text-slate-200">Crowd: {getCrowdLevel(activeZone?.people ?? 0)}</p>
            <p className="mt-2 text-sm text-slate-200">Wait Time: {zoneWait} mins</p>
            <p className="mt-2 text-sm text-slate-200">Suggestion: {zoneRecommendation}</p>
            <p className="mt-4 text-xs text-slate-400">
              Click different zones to inspect movement pressure in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
