# Smart Stadium AI Assistant
An intelligent, proactive stadium companion predicting crowd behavior, estimating queue times, and providing live AI chat guidance powered by Google Gemini.

## Chosen Vertical
**AI Crowd Intelligence & Smart Stadium Assistant**

## Approach and Logic
Large stadium venues often face immense crowd congestion, long food stall queues, and difficult navigation during high-pressure moments like halftime and post-match exit rushes. 
Our approach tackles this preemptively: instead of just placing people on a map, we use predictive forecasting combined with a modified Dijkstra's pathfinding algorithm to route users **around** future bottlenecks, avoiding the "herding effect".

## How the Solution Works
1. **Live Simulation Core**: The dashboard ingests local event phase and mock telemetry to generate "current" crowd pressure metrics.
2. **Predictive Routing**: A routing engine assigns dynamic weights to stadium zones. Paths are computed in real-time, directing users safely balancing walk-time vs. crowd density.
3. **AI Chat Assistant (Google Gemini)**: The Google Gemini API processes real-time contextual data (wait times, location, predicted surges, and optimal routes) to intelligently answer natural language questions from the fan natively in the UI.

## Assumptions Made
1. **Event Phases**: We assume standard event progression (Pre-Match, Half-Time, Post-Match) acts as a primary trigger for predictable crowd displacement.
2. **Hardware Environment**: We assume a real-world deployment would have indoor WiFi triangulations and BLE beacons validating a user's zone natively.
3. **Connectivity**: Since the Gemini integration evaluates real-time data, we assume standard 4G/5G stadium connectivity exists, or lightweight edge-caching is applied.

## Meaningful Integration of Google Services
This project leverages **Google Gemini 2.5 Flash** (via `@google/genai`) to provide an instantaneous, highly contextual AI Chat Assistant. By securely embedding real-time application state and routing logic dynamically into the Gemini prompt instructions, the model is fully aware of the user's location, goal, stadium food times, and the safest computed paths.

## Evaluation Focus Areas
- **Code Quality**: Structured into modular React components with specialized utility files for routing vs. AI logic.
- **Security**: Environment variables protect the Gemini API key.
- **Accessibility & Usage**: Includes ADA-compliant routing parameters, prioritizing elevators over stairs based on user need, wrapped in a high-contrast dynamic UI.

## Getting Started
Ensure you have created a `.env` file containing your Google Gemini API Key:
```text
VITE_GEMINI_API_KEY=your_key_here
```

Then install and run:
```bash
npm install
npm run dev
```

### Hackathon Rules Compliance
- **Repo Limits**: Monorepo size < 1MB.
- **Branch**: Everything is committed directly to a single `main` branch.
- **Public Visibility**: Available publicly.
