import { useEffect, useMemo, useState } from 'react';
import ChatAssistant from '../components/ChatAssistant';
import Heatmap from '../components/Heatmap';
import Map from '../components/Map';
import crowdZones from '../data/crowdData.json';
import stalls from '../data/stallsData.json';
import {
  buildAlerts,
  buildSmartSuggestions,
  estimateWaitTime,
  getLiveStatus,
  getPhaseMultiplier,
  getPhaseTheme,
  predictZoneTrend,
} from '../utils/prediction';
import { getGoalDestination } from '../utils/routing';

const phases = ['Pre-Match', 'First Half', 'Halftime', 'Second Half', 'Post-Match'];
const insightTone = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  sky: 'border-sky-200 bg-sky-50 text-sky-900',
  rose: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function Dashboard({ userProfile, onResetExperience }) {
  const [phase, setPhase] = useState('Halftime');
  const [destination, setDestination] = useState(getGoalDestination(userProfile?.goal));
  const theme = getPhaseTheme(phase);

  useEffect(() => {
    setDestination(getGoalDestination(userProfile?.goal));
  }, [userProfile]);

  const adjustedZones = useMemo(
    () =>
      crowdZones.map((zone) => ({
        ...zone,
        people: Math.round(zone.people * getPhaseMultiplier(phase)),
      })),
    [phase],
  );

  const queueCards = useMemo(
    () =>
      stalls.map((stall) => ({
        ...stall,
        waitTime: estimateWaitTime(
          Math.round(stall.queueLength * getPhaseMultiplier(phase)),
          stall.avgServiceTime,
        ),
      })),
    [phase],
  );

  const alerts = buildAlerts(adjustedZones, queueCards, phase);
  const smartSuggestions = buildSmartSuggestions(adjustedZones, queueCards, phase);
  const liveStatus = getLiveStatus(adjustedZones, queueCards, phase);

  return (
    <div className="space-y-8 pb-10 pt-4">
      <section
        className={`glass-card overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-r ${theme.surface} p-5 shadow-glow`}
      >
        <div className="grid gap-3 lg:grid-cols-4">
          <div className="rounded-[24px] bg-slate-950 px-5 py-4 text-white shadow-lg transition duration-500 hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Stadium Status</p>
            <p className="mt-2 text-2xl font-bold">{liveStatus.status}</p>
            <p className="mt-1 text-sm text-slate-300">Phase-aware crowd intensity</p>
          </div>
          <div className="rounded-[24px] bg-white/90 px-5 py-4 shadow-sm transition duration-500 hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Avg Wait Time</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{liveStatus.averageWait} mins</p>
            <p className="mt-1 text-sm text-slate-600">Live estimate across active stalls</p>
          </div>
          <div className="rounded-[24px] bg-white/90 px-5 py-4 shadow-sm transition duration-500 hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Visitor Profile</p>
            <p className="mt-2 text-lg font-bold text-slate-950">{userProfile.gate}</p>
            <p className="mt-1 text-sm text-slate-600">{userProfile.seat} | {userProfile.goalLabel}</p>
          </div>
          <div className="rounded-[24px] bg-white/90 px-5 py-4 shadow-sm transition duration-500 hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Alert</p>
            <p className="mt-2 text-lg font-bold text-slate-950">{liveStatus.alert}</p>
            <p className={`mt-1 text-sm font-semibold ${theme.accent}`}>Signal refreshed for {phase}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="glass-card rounded-[32px] p-7 shadow-glow">
          <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${theme.accent}`}>
            Personalized Dashboard
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-slate-950">
            Guidance tuned for {userProfile.gate}, {userProfile.seat}, and your {userProfile.goalLabel.toLowerCase()} plan.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Switch the event phase to simulate changing traffic patterns and see how the
            system adapts route guidance, queue estimates, alerts, and assistant responses.
          </p>
          <button
            type="button"
            onClick={onResetExperience}
            className="mt-6 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reset Entry Profile
          </button>
        </div>

        <div className="glass-card rounded-[32px] p-6 shadow-glow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${theme.accent}`}>
                Event Phase
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Pulse Control</h2>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.badge}`}>
              {phase}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {phases.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPhase(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                  phase === item
                    ? theme.badge
                    : 'bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-50'
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

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Heatmap zones={adjustedZones} phase={phase} />

          <section className="glass-card rounded-[28px] p-6 shadow-glow">
            <div className="mb-5">
              <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${theme.accent}`}>
                Smart Suggestions
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-950">
                What should you do now?
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {smartSuggestions.map((suggestion) => (
                <div
                  key={suggestion.title}
                  className={`rounded-[24px] border p-4 transition duration-300 hover:-translate-y-1 ${insightTone[suggestion.tone]}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                    Insight
                  </p>
                  <h3 className="mt-2 text-lg font-bold">{suggestion.title}</h3>
                  <p className="mt-3 text-sm leading-7">{suggestion.action}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="glass-card rounded-[28px] p-6 shadow-glow">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${theme.accent}`}>
                Queue Prediction
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-950">
                Best food options for your current journey
              </h2>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.badge}`}>
              Live Scan
            </div>
          </div>
          <div className="space-y-3">
            {queueCards
              .slice()
              .sort((a, b) => a.waitTime - b.waitTime)
              .map((stall) => (
                <div
                  key={stall.name}
                  className="rounded-2xl border border-slate-200 bg-white/85 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
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
      </section>

      <Map
        crowdZones={adjustedZones}
        destination={destination}
        onDestinationChange={setDestination}
        userProfile={userProfile}
      />

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <ChatAssistant
          crowdZones={adjustedZones}
          stalls={queueCards}
          phase={phase}
          userProfile={userProfile}
        />

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
              <div
                key={alert}
                className="rounded-2xl border border-rose-100 bg-rose-50 p-4 transition duration-300 hover:-translate-y-1"
              >
                <p className="text-sm font-medium leading-7 text-rose-900">{alert}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
