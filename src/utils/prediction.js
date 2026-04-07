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
  const fastestStall = [...stalls].sort(
    (a, b) =>
      estimateWaitTime(a.queueLength, a.avgServiceTime) -
      estimateWaitTime(b.queueLength, b.avgServiceTime),
  )[0];

  return [
    `${busiestZone.zone} is currently the busiest zone. Consider rerouting via a side corridor.`,
    `${fastestStall.name} has the shortest estimated wait right now.`,
    phase === 'Halftime'
      ? 'Halftime surge expected. Grab food or visit restrooms now before the peak.'
      : `Event phase: ${phase}. Recommendations are tuned for this time window.`,
  ];
}
