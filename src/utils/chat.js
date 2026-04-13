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

function tokenizeMessage(message) {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function getEditDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function matchesConcept(tokens, keywords) {
  return tokens.some((token) =>
    keywords.some((keyword) => {
      if (token === keyword) return true;
      if (token.includes(keyword) || keyword.includes(token)) return token.length > 2;
      return token.length > 2 && getEditDistance(token, keyword) <= 1;
    }),
  );
}

function buildWelcomeMessage(userProfile) {
  if (!userProfile) {
    return 'I can help with routes, queue times, crowd surges, or the best exit. Ask me anything about moving around the stadium.';
  }

  return `I’m tracking live guidance from ${userProfile.gate} to ${userProfile.seat}. Ask for the fastest exit, best food option, nearest washroom, or a crowd update.`;
}

function buildLocalReply(message, crowdZones, stalls, phase, userProfile) {
  const normalizedMessage = message.toLowerCase();
  const compactMessage = normalizedMessage.replace(/[^a-z\s]/g, '').trim();
  const tokens = tokenizeMessage(message);
  const shortCasualMessage = tokens.length <= 4;
  const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
  const calmestZone = [...crowdZones].sort((a, b) => a.people - b.people)[0];
  const washroomRoute = getBestRoute('washroom', crowdZones, userProfile, phase);
  const exitRoute = getBestRoute('exit', crowdZones, userProfile, phase);
  const seatRoute = getBestRoute('seat', crowdZones, userProfile, phase);
  const foodRoute = getBestRoute('food', crowdZones, userProfile, phase);
  const alerts = buildAlerts(crowdZones, stalls, phase);
  const surgePrediction = predictZoneTrend(busiestZone.zone, phase);
  const wantsSeat = matchesConcept(tokens, ['seat', 'section', 'stand', 'ticket']);
  const wantsWashroom = matchesConcept(tokens, ['washroom', 'restroom', 'toilet', 'bathroom', 'loo']);
  const wantsExit = matchesConcept(tokens, ['exit', 'leave', 'outside', 'out', 'home']);
  const wantsFood = matchesConcept(tokens, ['food', 'eat', 'snack', 'drink', 'stall', 'burger', 'pizza', 'beverage', 'hungry']);
  const wantsCrowd = matchesConcept(tokens, ['crowd', 'busy', 'rush', 'queue', 'wait', 'packed', 'congestion', 'jam']);
  const wantsHelp = matchesConcept(tokens, ['help', 'guide', 'recommend', 'suggest', 'best']);
  const isGreeting = matchesConcept(tokens, ['hi', 'hey', 'hello', 'helo', 'hlo', 'hlw', 'hiya', 'yo', 'hola']);
  const isCheckIn = matchesConcept(tokens, ['how', 'sup', 'whats', 'up']);
  const isThanks = matchesConcept(tokens, ['thanks', 'thank', 'thx']);

  if (
    /^(good morning|good afternoon|good evening)\b/.test(compactMessage) ||
    (isGreeting && shortCasualMessage)
  ) {
    return userProfile
      ? 'Hi. What do you need right now: fastest exit, food, washroom, or a crowd update?'
      : 'Hi. What do you need help with: route guidance, food, washroom, crowd update, or exit?';
  }

  if (
    /(how are you|how r you|what'?s up|sup)\b/.test(normalizedMessage) ||
    (isCheckIn && shortCasualMessage)
  ) {
    return 'I’m ready and tracking the live stadium flow. Tell me where you want to go, and I’ll give you the smartest route right now.';
  }

  if (/(thanks|thank you|thx)\b/.test(normalizedMessage) || isThanks) {
    return 'Anytime. If you want, I can also check the fastest exit, shortest food queue, or the calmest route from where you are.';
  }

  if (/(seat|where.*seat|my seat|section|stand)/.test(normalizedMessage) || wantsSeat) {
    return `Your seat is ${userProfile?.seat ?? 'in your selected section'}. Best route right now: ${formatRoute(seatRoute)}. Estimated walk time is about ${seatRoute.walkTime} min.`;
  }

  if (/(washroom|toilet|restroom|bathroom)/.test(normalizedMessage) || wantsWashroom) {
    return `Best washroom route right now: ${formatRoute(washroomRoute)}. It should take about ${washroomRoute.walkTime} min and avoids the heavier pressure near ${busiestZone.zone}.`;
  }

  if (/(exit|leave|way out|go home)/.test(normalizedMessage) || wantsExit) {
    return `Best exit right now is ${exitRoute.recommendedZone}. Follow: ${formatRoute(exitRoute)}. Estimated walk time is ${exitRoute.walkTime} min.`;
  }

  if (/(food|eat|snack|drink|stall|burger|pizza|beverage)/.test(normalizedMessage) || wantsFood) {
    return `${fastestStall.name} at ${fastestStall.zone} is the quickest option right now with about a ${fastestStall.waitTime} min wait. Suggested path: ${formatRoute(foodRoute)}.`;
  }

  if (/(crowd|busy|rush|congestion|packed|queue|wait)/.test(normalizedMessage) || wantsCrowd) {
    return `${busiestZone.zone} is the busiest zone right now at ${getCrowdLevel(busiestZone.people)} crowd. ${surgePrediction} If you want a calmer route, move through ${calmestZone.zone}.`;
  }

  if (/(best|recommend|suggest|guide|help)/.test(normalizedMessage) || wantsHelp) {
    return `${alerts[0]} ${alerts[1]} ${phase === 'Halftime' ? 'If you need to move, do it now before the next surge.' : 'The calmest movement window is through ' + calmestZone.zone + '.'}`;
  }

  if (shortCasualMessage) {
    return userProfile
      ? `I’m here with live guidance for your position near ${userProfile.gate}. Ask me where to go for your seat, food, washroom, or the fastest exit and I’ll answer directly.`
      : 'I’m here to help with routes, food queues, washrooms, crowd conditions, or exits. Ask me where you want to go and I’ll guide you.';
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

    const systemInstruction = `You are a live Matchday Assistant for a Smart Stadium.
Be concise, clear, warm, and practical. Sound like a real assistant speaking to a fan, not a technical system prompt. Keep responses to 2-3 sentences max.
If the user greets you, greet them back naturally and immediately offer 2-4 concrete things you can help with.
If the user asks a vague question, guide them toward the next best action instead of giving a generic answer.
Do not mention hidden system logic, JSON, algorithms, or internal implementation details unless explicitly asked.

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
        model: 'gemini-1.5-flash',
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

export { buildWelcomeMessage };
