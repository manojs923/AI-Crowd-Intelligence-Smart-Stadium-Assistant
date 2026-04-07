import { buildAlerts, estimateWaitTime, getCrowdLevel, predictZoneTrend } from './prediction';
import { getBestRoute } from './routing';

export function getAssistantReply(message, crowdZones, stalls, phase, userProfile) {
  const input = message.toLowerCase();
  const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];
  const calmestZone = [...crowdZones].sort((a, b) => a.people - b.people)[0];
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
  const intro = userProfile
    ? `From ${userProfile.gate} near ${userProfile.seat}, `
    : '';

  if (input.includes('washroom')) {
    const route = getBestRoute('washroom', crowdZones, userProfile);
    return `${intro}the best washroom route is ${route.steps.join(' -> ')}. ${route.recommendedZone} is currently ${route.crowdLevel.toLowerCase()} crowd.`;
  }

  if (input.includes('food') || input.includes('stall')) {
    return `${intro}${fastestStall.name} in ${fastestStall.zone} is your best food option right now with about ${fastestStall.waitTime} minutes of waiting time.`;
  }

  if (input.includes('exit')) {
    const route = getBestRoute('exit', crowdZones, userProfile);
    return `${intro}the fastest exit recommendation is ${route.steps.join(' -> ')}. This avoids ${busiestZone.zone}, which is the busiest area.`;
  }

  if (input.includes('seat')) {
    const route = getBestRoute('seat', crowdZones, userProfile);
    return `${intro}your seat route is ${route.steps.join(' -> ')}.`;
  }

  if (input.includes('crowd') || input.includes('rush')) {
    return `${intro}${predictZoneTrend(busiestZone.zone, phase)}`;
  }

  if (input.includes('alert')) {
    return buildAlerts(crowdZones, stalls, phase).join(' ');
  }

  return `${intro}the calmest zone right now is ${calmestZone.zone} with ${getCrowdLevel(
    calmestZone.people,
  ).toLowerCase()} crowd. Ask me about food, washrooms, exits, or rush timing.`;
}
