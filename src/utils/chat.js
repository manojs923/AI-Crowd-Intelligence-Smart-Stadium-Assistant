import { GoogleGenAI } from '@google/genai';
import { buildAlerts, getCrowdLevel, predictZoneTrend } from './prediction';
import { getBestRoute } from './routing';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

function formatRoute(route) {
  if (!route?.steps?.length) {
    return 'Start from your current location and follow the nearest guidance signs.';
  }

  return route.steps.join(' -> ');
}

function buildLocalReply(message, crowdZones, stalls, phase, userProfile) {
  const normalizedMessage = message.toLowerCase();
  const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
  const calmestZone = [...crowdZones].sort((a, b) => a.people - b.people)[0];
  const washroomRoute = getBestRoute('washroom', crowdZones, userProfile, phase);
  const exitRoute = getBestRoute('exit', crowdZones, userProfile, phase);
  const seatRoute = getBestRoute('seat', crowdZones, userProfile, phase);
  const foodRoute = getBestRoute('food', crowdZones, userProfile, phase);
  const alerts = buildAlerts(crowdZones, stalls, phase);
  const surgePrediction = predictZoneTrend(busiestZone.zone, phase);

  if (/(hi|hello|hey)\b/.test(normalizedMessage)) {
    return userProfile
      ? `You're at ${userProfile.gate} and heading for ${userProfile.seat}. I can guide you to your seat, food, washrooms, or the best exit based on the live crowd.`
      : `I can help with the quickest seat, food, washroom, or exit guidance using the current crowd conditions.`;
  }

  if (/(seat|where.*seat|my seat|section|stand)/.test(normalizedMessage)) {
    return `Your seat is ${userProfile?.seat ?? 'in your selected section'}. Best route right now: ${formatRoute(seatRoute)}. Estimated walk time is about ${seatRoute.walkTime} min.`;
  }

  if (/(washroom|toilet|restroom|bathroom)/.test(normalizedMessage)) {
    return `Best washroom route right now: ${formatRoute(washroomRoute)}. It should take about ${washroomRoute.walkTime} min and avoids the heavier pressure near ${busiestZone.zone}.`;
  }

  if (/(exit|leave|way out|go home)/.test(normalizedMessage)) {
    return `Best exit right now is ${exitRoute.recommendedZone}. Follow: ${formatRoute(exitRoute)}. Estimated walk time is ${exitRoute.walkTime} min.`;
  }

  if (/(food|eat|snack|drink|stall|burger|pizza|beverage)/.test(normalizedMessage)) {
    return `${fastestStall.name} at ${fastestStall.zone} is the quickest option right now with about a ${fastestStall.waitTime} min wait. Suggested path: ${formatRoute(foodRoute)}.`;
  }

  if (/(crowd|busy|rush|congestion|packed|queue|wait)/.test(normalizedMessage)) {
    return `${busiestZone.zone} is the busiest zone right now at ${getCrowdLevel(busiestZone.people)} crowd. ${surgePrediction} If you want a calmer route, move through ${calmestZone.zone}.`;
  }

  if (/(best|recommend|suggest|guide|help)/.test(normalizedMessage)) {
    return `${alerts[0]} ${alerts[1]} ${phase === 'Halftime' ? 'If you need to move, do it now before the next surge.' : 'The calmest movement window is through ' + calmestZone.zone + '.'}`;
  }

  return `Right now I'd avoid ${busiestZone.zone} and use ${calmestZone.zone} where possible. If you tell me whether you need your seat, food, washroom, or exit, I'll give you the best route immediately.`;
}

export async function getAssistantReply(message, crowdZones, stalls, phase, userProfile) {
  const fallbackReply = buildLocalReply(message, crowdZones, stalls, phase, userProfile);

  try {
    const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];
    const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
    
    // Evaluate standard routing internally dynamically
    const washroomRoute = getBestRoute('washroom', crowdZones, userProfile, phase);
    const exitRoute = getBestRoute('exit', crowdZones, userProfile, phase);
    
    const alerts = buildAlerts(crowdZones, stalls, phase);
    const surgePrediction = predictZoneTrend(busiestZone.zone, phase);

    let extraContext = '';
    if (userProfile) {
        extraContext = `User Location: Gate ${userProfile.gate}, Seat ${userProfile.seat}. Their main matchday goal: ${userProfile.goalLabel}.`;
    }

    const systemInstruction = `You are a highly intelligent Matchday Assistant for a Smart Stadium. Your goal is to guide fans safely and efficiently away from congestion.
Be concise, helpful, friendly, and practical. Do not use overly formal language. Keep responses to 2-3 sentences max.

Real-Time Stadium Context:
- Current Match Phase: ${phase}
- Live Crowd Alerts: ${alerts.join(' | ') || 'No current alerts'}
- Future Crowd Surge Prediction: ${surgePrediction}
- Fastest Food Option: ${fastestStall.name} in ${fastestStall.zone} (Approx ${fastestStall.waitTime} min wait)
- Optimal dynamically-calculated Washroom Route for this user: ${washroomRoute.steps.join(' -> ')}
- Optimal dynamically-calculated Exit/Street Route for this user: ${exitRoute.steps.join(' -> ')}

${extraContext}

When a user asks for directions (washrooms, exits, food), use the optimal routes provided above. When they ask about crowd size, warn them about the surge predictions.`;

    if (!ai) {
      return fallbackReply;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
           systemInstruction: systemInstruction,
           temperature: 0.7,
        }
    });

    return response.text?.trim() || fallbackReply;

  } catch (err) {
    console.error("Gemini Error:", err);
    return fallbackReply;
  }
}
