export function getCrowdLevel(people) {
  if (people > 50) return 'High';
  if (people > 20) return 'Medium';
  return 'Low';
}

export function getCrowdColor(level) {
  if (level === 'High') return 'bg-rose-500';
  if (level === 'Medium') return 'bg-amber-400';
  return 'bg-emerald-500';
}

export function getCrowdTextColor(level) {
  if (level === 'High') return 'text-rose-700';
  if (level === 'Medium') return 'text-amber-700';
  return 'text-emerald-700';
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
    'Pre-Match': `Traffic is building around ${zone}. Arrive early to avoid a gate rush.`,
    'First Half': `${zone} should remain stable for the next 10 minutes.`,
    Halftime: `${zone} is likely to spike in the next 10 minutes as fans leave their seats.`,
    'Second Half': `${zone} should ease slightly as attendees return to the stands.`,
    'Post-Match': `${zone} will grow busy again as the crowd heads for exits.`,
  };

  return phaseMessages[phase] ?? `${zone} is being monitored for crowd changes.`;
}

export function buildAlerts(crowdZones, stalls, phase) {
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
  const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];

  return [
    `${busiestZone.zone} is currently the busiest zone. Consider rerouting via a side corridor.`,
    `${fastestStall.name} has the shortest estimated wait right now.`,
    phase === 'Halftime'
      ? 'Halftime surge expected. Grab food or visit restrooms now before the peak.'
      : `Event phase: ${phase}. Recommendations are tuned for this time window.`,
  ];
}

export function getPhaseTheme(phase) {
  const themes = {
    'Pre-Match': {
      surface: 'from-emerald-100/90 via-white to-sky-100/80',
      accent: 'text-emerald-700',
      badge: 'bg-emerald-500 text-white',
    },
    'First Half': {
      surface: 'from-sky-100/90 via-white to-cyan-100/80',
      accent: 'text-sky-700',
      badge: 'bg-sky-500 text-white',
    },
    Halftime: {
      surface: 'from-amber-100/90 via-orange-50 to-rose-100/70',
      accent: 'text-orange-700',
      badge: 'bg-orange-500 text-white',
    },
    'Second Half': {
      surface: 'from-blue-100/90 via-white to-indigo-100/70',
      accent: 'text-blue-700',
      badge: 'bg-blue-600 text-white',
    },
    'Post-Match': {
      surface: 'from-rose-100/90 via-orange-50 to-red-100/80',
      accent: 'text-rose-700',
      badge: 'bg-rose-600 text-white',
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
      title: 'Grab food now',
      action: `${fastestStall.name} in ${fastestStall.zone} is the quickest option at ${fastestStall.waitTime} mins.`,
      tone: 'emerald',
    },
    {
      title: 'Use the calm lane',
      action: `${calmestZone.zone} is the smoothest zone to move through with ${calmestZone.people} people.`,
      tone: 'sky',
    },
    {
      title: 'Avoid pressure buildup',
      action:
        phase === 'Post-Match'
          ? `${busiestZone.zone} is surging again. Start exiting early through a side corridor.`
          : `${busiestZone.zone} is the current hotspot. Delay that path until the next phase shift.`,
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
        ? `${busiestZone.zone} congestion is rising fast.`
        : `${busiestZone.zone} remains the zone to watch.`,
  };
}
