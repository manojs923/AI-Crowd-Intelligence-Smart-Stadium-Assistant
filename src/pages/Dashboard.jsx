import { useState } from 'react';
import ChatAssistant from '../components/ChatAssistant';
import Heatmap from '../components/Heatmap';
import Map from '../components/Map';
import crowdZones from '../data/crowdData.json';
import stalls from '../data/stallsData.json';
import {
  buildAlerts,
  estimateWaitTime,
  getPhaseMultiplier,
  predictZoneTrend,
} from '../utils/prediction';

const phases = ['Pre-Match', 'First Half', 'Halftime', 'Second Half', 'Post-Match'];

export default function Dashboard() {
  const [phase, setPhase] = useState('Halftime');
  const [destination, setDestination] = useState('seat');

  const adjustedZones = crowdZones.map((zone) => ({
    ...zone,
    people: Math.round(zone.people * getPhaseMultiplier(phase)),
  }));

  const queueCards = stalls.map((stall) => ({
    ...stall,
    waitTime: estimateWaitTime(
      Math.round(stall.queueLength * getPhaseMultiplier(phase)),
      stall.avgServiceTime,
    ),
  }));

  const alerts = buildAlerts(adjustedZones, queueCards, phase);

  return (
    <div className="space-y-8 pb-10 pt-4">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="glass-card rounded-[32px] p-7 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
            Live Dashboard
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-slate-950">
            Real-time event guidance for crowd flow, queues, and fan support.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Switch the event phase to simulate changing traffic patterns and see how the
            system adapts route guidance, queue estimates, and assistant responses.
          </p>
        </div>

        <div className="glass-card rounded-[32px] p-6 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
            Event Phase
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {phases.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPhase(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  phase === item
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Prediction</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {predictZoneTrend(adjustedZones[0].zone, phase)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Heatmap zones={adjustedZones} />
        <section className="glass-card rounded-[28px] p-6 shadow-glow">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
              Queue Prediction
            </p>
            <h2 className="font-display text-2xl font-bold text-slate-950">
              Food stall waiting times
            </h2>
          </div>
          <div className="space-y-3">
            {queueCards
              .sort((a, b) => a.waitTime - b.waitTime)
              .map((stall) => (
                <div
                  key={stall.name}
                  className="rounded-2xl border border-slate-200 bg-white/85 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{stall.name}</h3>
                      <p className="text-sm text-slate-500">
                        {stall.type} | {stall.zone}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                      {stall.waitTime} mins
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      <Map
        crowdZones={adjustedZones}
        destination={destination}
        onDestinationChange={setDestination}
      />

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <ChatAssistant crowdZones={adjustedZones} stalls={queueCards} phase={phase} />

        <section className="glass-card rounded-[28px] p-6 shadow-glow">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-600">
              Real-Time Alerts
            </p>
            <h2 className="font-display text-2xl font-bold text-slate-950">
              Actionable recommendations
            </h2>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert} className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                <p className="text-sm font-medium leading-7 text-rose-900">{alert}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}