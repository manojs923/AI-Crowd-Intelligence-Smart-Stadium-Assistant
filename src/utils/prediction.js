export function getCrowdLevel(people) {
  if (people > 50) return 'High';
  if (people > 20) return 'Medium';
  return 'Low';
}

export function getCrowdColor(level) {
  if (level === 'High') return 'bg-rose-500';
  if (level === 'Medium') return 'bg-amber-400';
  return 'bg-lime-400';
}

export function getCrowdTextColor(level) {
  if (level === 'High') return 'text-rose-200';
  if (level === 'Medium') return 'text-amber-200';
  return 'text-lime-200';
}

export function estimateWaitTime(queueLength, avgServiceTime) {
  return Math.round(queueLength * avgServiceTime);
}

export function getPhaseMultiplier(phase) {
  const multipliers = {
    'Pre-Match': 0.85,
    'First Half': 1,
    Halftime: 1.45,
    'Second Half': 0.95,
    'Post-Match': 1.3,
  };

  return multipliers[phase] ?? 1;
}

export function predictZoneTrend(zone, phase) {
  const phaseMessages = {
    'Pre-Match': `Traffic is building around ${zone}. Move early before the turnstile rush spikes.`,
    'First Half': `${zone} should stay steady for the next 10 minutes with a smooth movement window.`,
    Halftime: `${zone} is likely to surge in the next 10 minutes as fans break from the stands.`,
    'Second Half': `${zone} should settle slightly as supporters head back to their seats.`,
    'Post-Match': `${zone} will tighten again as the crowd streams toward the exits.`,
  };

  return phaseMessages[phase] ?? `${zone} is being monitored for crowd changes.`;
}

export function buildAlerts(crowdZones, stalls, phase) {
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
  const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];

  return [
    `${busiestZone.zone} is the busiest zone right now. Use a side corridor if you can.`,
    `${fastestStall.name} is serving fastest with an estimated ${fastestStall.waitTime} minute wait.`,
    phase === 'Halftime'
      ? 'Halftime surge rising. Food and washrooms will get busier in the next few minutes.'
      : `Phase set to ${phase}. Guidance is tuned to this match window.`,
  ];
}

export function getPhaseTheme(phase) {
  const themes = {
    'Pre-Match': {
      surface: 'from-lime-400/20 via-white/5 to-cyan-400/10',
      accent: 'text-lime-300',
      badge: 'bg-lime-300 text-slate-950',
      border: 'border-lime-300/20',
    },
    'First Half': {
      surface: 'from-sky-400/18 via-white/5 to-cyan-400/10',
      accent: 'text-sky-300',
      badge: 'bg-sky-400 text-slate-950',
      border: 'border-sky-300/20',
    },
    Halftime: {
      surface: 'from-amber-300/20 via-orange-400/10 to-rose-400/10',
      accent: 'text-amber-200',
      badge: 'bg-amber-300 text-slate-950',
      border: 'border-amber-200/20',
    },
    'Second Half': {
      surface: 'from-indigo-400/20 via-sky-400/8 to-white/5',
      accent: 'text-indigo-200',
      badge: 'bg-indigo-300 text-slate-950',
      border: 'border-indigo-200/20',
    },
    'Post-Match': {
      surface: 'from-rose-400/18 via-orange-400/10 to-white/5',
      accent: 'text-rose-200',
      badge: 'bg-rose-300 text-slate-950',
      border: 'border-rose-200/20',
    },
  };

  return themes[phase] ?? themes['First Half'];
}

export function buildSmartSuggestions(crowdZones, stalls, phase) {
  const sortedZones = [...crowdZones].sort((a, b) => a.people - b.people);
  const calmestZone = sortedZones[0];
  const busiestZone = sortedZones[sortedZones.length - 1];
  const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];

  return [
    {
      title: 'Fast snack run',
      action: `${fastestStall.name} in ${fastestStall.zone} is the quickest option at ${fastestStall.waitTime} min.`,
      tone: 'lime',
    },
    {
      title: 'Move through the calm lane',
      action: `${calmestZone.zone} is the smoothest zone with only ${calmestZone.people} people detected.`,
      tone: 'sky',
    },
    {
      title: 'Avoid pressure buildup',
      action:
        phase === 'Post-Match'
          ? `${busiestZone.zone} is surging again. Start your exit through a side path now.`
          : `${busiestZone.zone} is the hotspot. Delay that path until the next phase shift.`,
      tone: 'rose',
    },
  ];
}

export function getLiveStatus(crowdZones, stalls, phase) {
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
  const averageWait = Math.round(
    stalls.reduce((total, stall) => total + stall.waitTime, 0) / stalls.length,
  );

  return {
    status: `${getCrowdLevel(busiestZone.people)} crowd`,
    averageWait,
    alert:
      phase === 'Halftime'
        ? `${busiestZone.zone} congestion is climbing quickly.`
        : `${busiestZone.zone} remains the zone to watch.`,
  };
}
