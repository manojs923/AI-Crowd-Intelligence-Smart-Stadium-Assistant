import { GoogleGenAI } from '@google/genai';
import { buildAlerts, predictZoneTrend } from './prediction';
import { getBestRoute } from './routing';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export async function getAssistantReply(message, crowdZones, stalls, phase, userProfile) {
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

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
           systemInstruction: systemInstruction,
           temperature: 0.7,
        }
    });

    return response.text();

  } catch (err) {
    console.error("Gemini Error:", err);
    return "I'm experiencing an AI core interruption at the moment. Please check the real-world live map on your dashboard to see routing details directly!";
  }
}

