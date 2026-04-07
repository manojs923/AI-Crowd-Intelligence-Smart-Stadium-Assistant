import { buildAlerts, estimateWaitTime, getCrowdLevel, predictZoneTrend } from './prediction';
import { getBestRoute } from './routing';

export function getAssistantReply(message, crowdZones, stalls, phase) {
  const input = message.toLowerCase();
  const fastestStall = [...stalls].sort(
    (a, b) =>
      estimateWaitTime(a.queueLength, a.avgServiceTime) -
      estimateWaitTime(b.queueLength, b.avgServiceTime),
  )[0];
  const calmestZone = [...crowdZones].sort((a, b) => a.people - b.people)[0];
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];

  if (input.includes('washroom')) {
    const route = getBestRoute('washroom', crowdZones);
    return `Nearest low-pressure route: ${route.steps.join(' -> ')}. ${route.recommendedZone} is currently ${route.crowdLevel.toLowerCase()} crowd.`;
  }

  if (input.includes('food') || input.includes('stall')) {
    const wait = estimateWaitTime(fastestStall.queueLength, fastestStall.avgServiceTime);
    return `${fastestStall.name} in ${fastestStall.zone} is the best pick right now with about ${wait} minutes of waiting time.`;
  }

  if (input.includes('exit')) {
    const route = getBestRoute('exit', crowdZones);
    return `Fastest exit recommendation: ${route.steps.join(' -> ')}. This avoids ${busiestZone.zone}, which is currently the busiest area.`;
  }

  if (input.includes('crowd') || input.includes('rush')) {
    return predictZoneTrend(busiestZone.zone, phase);
  }

  if (input.includes('alert')) {
    return buildAlerts(crowdZones, stalls, phase).join(' ');
  }

  return `Current calm zone is ${calmestZone.zone} with ${getCrowdLevel(
    calmestZone.people,
  ).toLowerCase()} crowd. Ask me about food, washrooms, exits, or rush timing.`;
}
