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
    const route = getBestRoute('washroom', crowdZones, userProfile, phase);
    return `${intro}the best washroom route is ${route.steps.join(' -> ')}. ${route.recommendedZone} is currently ${route.crowdLevel.toLowerCase()} crowd.`;
  }

  if (input.includes('food') || input.includes('stall')) {
    return `${intro}${fastestStall.name} in ${fastestStall.zone} is your best food option right now with about ${fastestStall.waitTime} minutes of waiting time.`;
  }

  if (input.includes('metro')) {
    const route = getBestRoute('metro', crowdZones, userProfile, phase);
    return `${intro}your best route to the Metro 🚇 is ${route.steps.join(' -> ')}. (Approx ${route.walkTime} min walk, balancing indoor and outdoor crowd levels).`;
  }

  if (input.includes('cab')) {
    const route = getBestRoute('cab', crowdZones, userProfile, phase);
    return `${intro}to reach the Cab Zone 🚖, take this path: ${route.steps.join(' -> ')}. (Approx ${route.walkTime} min walk).`;
  }

  if (input.includes('bus')) {
    const route = getBestRoute('bus', crowdZones, userProfile, phase);
    return `${intro}the smartest path to the Bus Stop 🚌 is ${route.steps.join(' -> ')}. (Approx ${route.walkTime} min walk).`;
  }

  if (input.includes('exit') || input.includes('leave') || input.includes('home')) {
    const route = getBestRoute('exit', crowdZones, userProfile, phase);
    return `${intro}your optimal exit route is ${route.steps.join(' -> ')}. This dynamically routes you away from both indoor bottlenecks and overcrowded outdoor streets!`;
  }

  if (input.includes('seat')) {
    const route = getBestRoute('seat', crowdZones, userProfile, phase);
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
