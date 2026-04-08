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
  lime: 'border-lime-300/20 bg-lime-300/10 text-lime-100',
  sky: 'border-sky-300/20 bg-sky-300/10 text-sky-100',
  rose: 'border-rose-300/20 bg-rose-300/10 text-rose-100',
};

function getWalkingMinutes(fromZone, toZone, zones) {
  const from = zones.find((zone) => zone.zone === fromZone);
  const to = zones.find((zone) => zone.zone === toZone);

  if (!from || !to) return 2;

  const deltaX = from.x - to.x;
  const deltaY = from.y - to.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return Math.max(2, Math.round(distance / 14));
}

export default function Dashboard({ userProfile, onResetExperience }) {
  const [phase, setPhase] = useState('Halftime');
  const [destination, setDestination] = useState(getGoalDestination(userProfile?.goal));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [navigationStatus, setNavigationStatus] = useState('idle');
  const [routeSavings, setRouteSavings] = useState(0);
  const theme = getPhaseTheme(phase);

  useEffect(() => {
    setDestination(getGoalDestination(userProfile?.goal));
  }, [userProfile]);

  useEffect(() => {
    setIsRefreshing(true);
    setLastUpdatedAt(Date.now());
    const timer = window.setTimeout(() => setIsRefreshing(false), 900);
    return () => window.clearTimeout(timer);
  }, [phase, destination, userProfile]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setLastUpdatedAt(Date.now());
      setIsRefreshing(true);
      window.setTimeout(() => setIsRefreshing(false), 700);
    }, 9000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (navigationStatus !== 'navigating') return undefined;

    const rerouteTimer = window.setTimeout(() => {
      const savings = phase === 'Halftime' ? 2 : 1;
      setRouteSavings(savings);
      setNavigationStatus('rerouting');
    }, 9000);

    const resumeTimer = window.setTimeout(() => {
      setNavigationStatus('navigating');
    }, 13000);

    return () => {
      window.clearTimeout(rerouteTimer);
      window.clearTimeout(resumeTimer);
    };
  }, [navigationStatus, phase]);

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
  const secondsAgo = Math.max(1, Math.round((Date.now() - lastUpdatedAt) / 1000));
  const calmestZone = adjustedZones.slice().sort((a, b) => a.people - b.people)[0];
  const busiestZone = adjustedZones.slice().sort((a, b) => b.people - a.people)[0];

  const queueChoices = useMemo(
    () =>
      queueCards
        .map((stall) => {
          const walkTime = getWalkingMinutes(userProfile.gate, stall.zone, adjustedZones);
          return {
            ...stall,
            walkTime,
            totalTime: walkTime + stall.waitTime,
          };
        })
        .sort((a, b) => a.totalTime - b.totalTime),
    [adjustedZones, queueCards, userProfile.gate],
  );

  const bestChoice = queueChoices[0];
  const recommendedDestination = phase === 'Halftime' ? 'food' : 'seat';
  const actionCard =
    phase === 'Halftime'
      ? {
          title: `Go now -> ${bestChoice.zone}`,
          detail: `${bestChoice.totalTime} min total | ${bestChoice.walkTime} min walk + ${bestChoice.waitTime} min wait`,
          urgency: 'Go now - crowd increases in 3 mins',
          ai: `AI says: ${bestChoice.name} is the quickest choice right now.`,
          tone: 'border-amber-300/25 bg-amber-300/12',
        }
      : {
          title: `Go now -> ${calmestZone.zone}`,
          detail: `Low crowd route | ${getWalkingMinutes(userProfile.gate, calmestZone.zone, adjustedZones)} min walk`,
          urgency: 'Go now - this is the calmest path',
          ai: `AI says: use ${calmestZone.zone} before pressure builds near ${busiestZone.zone}.`,
          tone: 'border-lime-300/25 bg-lime-300/10',
        };

  const primaryAlert = `${busiestZone.zone.toUpperCase()} OVERLOADED`;

  const handleStartNavigation = () => {
    setDestination(recommendedDestination);
    setNavigationStatus('navigating');
    setRouteSavings(0);
  };

  const navigationMessage =
    navigationStatus === 'rerouting'
      ? `Crowd spike detected -> Re-routing... New path saves ${routeSavings} min`
      : navigationStatus === 'navigating'
        ? 'Navigation active -> Updating every 5s based on crowd flow'
        : null;

  return (
    <div className="space-y-5 pb-12 pt-1 md:space-y-6">
      <section className={`stadium-panel overflow-hidden rounded-[2rem] border ${theme.border} p-5 md:p-7`}>
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${theme.badge}`}>
                {phase}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">
                {userProfile.gate} | {userProfile.seat}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">
                Updated {secondsAgo}s ago
              </span>
            </div>
            <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-sky-100">
              {isRefreshing ? 'Recalculating...' : 'Live guidance on'}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <article className={`rounded-[1.8rem] border p-5 shadow-glow ${actionCard.tone}`}>
              <p className="section-label text-[11px] font-semibold uppercase text-white/75">Do This Now</p>
              <h1 className="mt-3 font-display text-6xl uppercase leading-[0.92] text-white md:text-7xl">
                {actionCard.title}
              </h1>
              <p className="mt-4 text-lg font-semibold text-slate-100">{actionCard.detail}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-white">{actionCard.urgency}</p>
              <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="section-label text-[10px] font-semibold uppercase text-lime-200">AI Coach</p>
                <p className="mt-2 text-sm text-slate-100">{actionCard.ai}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleStartNavigation}
                  className="rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-slate-950"
                >
                  {navigationStatus === 'idle' ? 'Follow Route' : 'Navigating...'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white"
                >
                  Ask Why
                </button>
              </div>
            </article>

            <div className="grid gap-3">
              <div className="rounded-[1.5rem] border border-rose-300/20 bg-rose-300/14 p-4">
                <p className="section-label text-[10px] font-semibold uppercase text-rose-100">Priority Alert</p>
                <p className="mt-3 text-3xl font-bold uppercase text-white">{primaryAlert}</p>
                <p className="mt-2 text-sm text-slate-100">Use {calmestZone.zone} instead.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="score-panel rounded-[1.5rem] p-4">
                  <p className="section-label text-[10px] font-semibold uppercase text-lime-200">Crowd Status</p>
                  <p className="mt-3 font-display text-4xl uppercase leading-none text-white">{liveStatus.status}</p>
                </div>
                <div className="score-panel rounded-[1.5rem] p-4">
                  <p className="section-label text-[10px] font-semibold uppercase text-lime-200">Average Wait</p>
                  <p className="mt-3 font-display text-4xl uppercase leading-none text-white">{liveStatus.averageWait} min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {navigationMessage ? (
        <section className={`rounded-[1.5rem] border p-4 shadow-glow ${navigationStatus === 'rerouting' ? 'border-amber-300/25 bg-amber-300/12' : 'border-lime-300/20 bg-lime-300/10'}`}>
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-white">{navigationMessage}</p>
        </section>
      ) : null}

      <Map
        crowdZones={adjustedZones}
        destination={destination}
        onDestinationChange={setDestination}
        userProfile={userProfile}
      />

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="glass-card rounded-[1.75rem] border-white/10 bg-white/5 p-5 shadow-glow">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className={`section-label text-[11px] font-semibold uppercase ${theme.accent}`}>
                Queue Decision
              </p>
              <h2 className="mt-2 font-display text-4xl uppercase leading-none text-white">
                Best food option right now
              </h2>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${theme.badge}`}>
              Live Scan
            </div>
          </div>

          <div className="mb-4 rounded-[1.25rem] border border-lime-300/20 bg-lime-300/10 p-4">
            <p className="section-label text-[10px] font-semibold uppercase text-lime-200">Best choice</p>
            <p className="mt-2 text-2xl font-bold text-white">{bestChoice.name}</p>
            <p className="mt-2 text-sm text-slate-100">
              {bestChoice.walkTime} min walk + {bestChoice.waitTime} min wait = {bestChoice.totalTime} min total
            </p>
          </div>

          <div className="space-y-3">
            {queueChoices.slice(0, 3).map((stall, index) => (
              <div
                key={stall.name}
                className={`rounded-[1.25rem] border p-4 transition duration-300 hover:-translate-y-1 ${
                  index === 0 ? 'border-lime-300/20 bg-lime-300/10' : 'border-white/10 bg-slate-950/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold uppercase tracking-[0.08em] text-white">{stall.name}</h3>
                    <p className="text-sm text-slate-300">{stall.type} | {stall.zone}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.08em] text-slate-400">
                      {stall.walkTime} min walk + {stall.waitTime} min wait
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold uppercase tracking-[0.08em] text-slate-950">
                    {stall.totalTime} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card rounded-[1.75rem] border-white/10 bg-white/5 p-5 shadow-glow">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="section-label text-[11px] font-semibold uppercase text-rose-200">Live Alert</p>
              <h2 className="mt-2 font-display text-4xl uppercase leading-none text-white">Take this route instead</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="rounded-full bg-lime-300 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-950"
            >
              Open AI Assistant
            </button>
          </div>
          <div className="rounded-[1.25rem] border border-rose-300/20 bg-rose-300/12 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-rose-100">Alert</p>
            <p className="mt-2 text-lg font-bold text-white">{primaryAlert}</p>
            <p className="mt-2 text-sm text-slate-100">Recommended: {calmestZone.zone}</p>
            <p className="mt-2 text-sm text-slate-300">{alerts[0]}</p>
          </div>
        </article>
      </section>

      <section className="glass-card rounded-[1.75rem] border-white/10 bg-white/5 p-5 shadow-glow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label text-[11px] font-semibold uppercase text-sky-300">Advanced View</p>
            <h2 className="mt-2 font-display text-4xl uppercase leading-none text-white">Demo mode and detailed insights</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAdvanced((current) => !current)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-200"
            >
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </button>
            <button
              type="button"
              onClick={onResetExperience}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-200"
            >
              Reset Profile
            </button>
          </div>
        </div>

        {showAdvanced ? (
          <div className="mt-5 space-y-5">
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
              <p className="section-label text-[11px] font-semibold uppercase text-sky-300">Simulation Control</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {phases.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPhase(item)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                      phase === item
                        ? theme.badge
                        : 'bg-slate-900 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-300">{predictZoneTrend(adjustedZones[0].zone, phase)}</p>
            </article>

            <section className="grid gap-4 lg:grid-cols-3">
              {smartSuggestions.map((suggestion) => (
                <article
                  key={suggestion.title}
                  className={`rounded-[1.5rem] border p-5 shadow-glow ${insightTone[suggestion.tone]}`}
                >
                  <p className="section-label text-[10px] font-semibold uppercase opacity-75">Quick play</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">{suggestion.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-100">{suggestion.action}</p>
                </article>
              ))}
            </section>

            <Heatmap zones={adjustedZones} phase={phase} />
          </div>
        ) : null}
      </section>

      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-lime-300 px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-950 shadow-[0_18px_40px_rgba(190,242,100,0.28)] transition hover:-translate-y-0.5"
      >
        AI Coach
      </button>

      {isChatOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/70 p-0 backdrop-blur-sm md:items-center md:justify-center md:p-6">
          <div className="w-full max-w-5xl">
            <ChatAssistant
              crowdZones={adjustedZones}
              stalls={queueCards}
              phase={phase}
              userProfile={userProfile}
              isSheet
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
