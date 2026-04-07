# AI Crowd Intelligence & Smart Stadium Assistant

An AI-powered smart stadium prototype that predicts crowd behavior, estimates queue times, and guides fans with safer and faster movement recommendations.

## Overview

Large stadium venues often face crowd congestion, long food stall queues, poor navigation, and delayed decision-making during high-pressure moments like halftime and post-match exit flow.

This project addresses that problem with a lightweight web app that simulates:

- crowd density across stadium zones
- queue prediction for food stalls
- least-crowded route suggestions
- real-time alerts and guidance
- an AI-style chat assistant for visitor questions

## Features

- Smart Navigation: Suggests routes to seats, food stalls, washrooms, and exits
- Crowd Heatmap: Displays low, medium, and high-density stadium zones
- Queue Prediction: Estimates waiting times for food stalls
- Predictive Alerts: Adapts recommendations based on event phase
- Chat Assistant: Answers common visitor questions with rule-based guidance

## Event Phases Simulated

- Pre-Match
- First Half
- Halftime
- Second Half
- Post-Match

The dashboard updates crowd levels, queue times, and suggestions based on the selected phase.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- JSON mock datasets

## Project Structure

```text
src/
|-- components/
|   |-- ChatAssistant.jsx
|   |-- Heatmap.jsx
|   `-- Map.jsx
|-- data/
|   |-- crowdData.json
|   `-- stallsData.json
|-- pages/
|   |-- Dashboard.jsx
|   `-- Home.jsx
|-- utils/
|   |-- chat.js
|   |-- prediction.js
|   `-- routing.js
|-- App.jsx
|-- index.css
`-- main.jsx
```

## How It Works

1. Mock crowd data is loaded from JSON files.
2. The selected event phase changes crowd intensity using phase multipliers.
3. Queue waiting time is estimated using:

```javascript
waitTime = queueLength * avgServiceTime;
```

4. Route and assistant recommendations are generated from the adjusted crowd conditions.

## Getting Started

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Current Status

- Frontend prototype completed
- Dashboard flow implemented
- Mock AI guidance logic implemented
- Project builds successfully

## Future Improvements

- Integrate live sensor or camera-based crowd inputs
- Add real indoor maps with path visualization
- Support multilingual chat responses
- Add authentication and personalized seat information
- Connect alerts to live event operations

## Submission Notes

- Public GitHub repository
- Single `main` branch workflow
- `node_modules` and `dist` are excluded from Git tracking
- Tracked repository size is currently well below 1 MB
