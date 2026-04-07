# AI Crowd Intelligence & Smart Stadium Assistant

An AI-powered system that predicts crowd behavior and provides real-time smart guidance to enhance stadium experience and safety.

## Problem Statement

Large-scale stadium venues often struggle with:

- Crowd congestion at gates, corridors, and exits
- Long waiting times at food stalls and restrooms
- Lack of real-time coordination and guidance
- Difficulty in navigation inside the stadium

These issues reduce user experience, safety, and operational efficiency.

## Solution Overview

This project proposes a lightweight AI-powered smart stadium assistant that:

- Predicts crowd behavior using simulated data
- Recommends less crowded routes
- Estimates queue times at stalls
- Offers real-time alerts and guidance
- Supports users through a chat-style AI assistant

## Core Features

### 1. Smart Navigation

- Interactive route guidance to seats, food stalls, washrooms, and exits
- Suggests the least crowded path based on mock crowd conditions

### 2. Crowd Heatmap

- Displays high, medium, and low crowd zones
- Uses simulated zone occupancy data

### 3. Queue Prediction

- Estimates waiting times at food stalls
- Recommends better alternatives with shorter queues

### 4. AI Chat Assistant

Users can ask questions like:

- Where is the nearest washroom?
- Best time to get food?
- What is the fastest exit?

### 5. Predictive Suggestions

- Forecasts crowd increase during phases like halftime or post-match
- Encourages users to move before rush periods

### 6. Real-Time Alerts

- Congestion warnings
- Better gate suggestions
- Exit guidance

## Tech Stack

- React.js
- Vite
- Tailwind CSS
- JSON mock data

## Project Structure

```text
smart-stadium-ai/
|-- src/
|   |-- components/
|   |   |-- ChatAssistant.jsx
|   |   |-- Heatmap.jsx
|   |   `-- Map.jsx
|   |-- data/
|   |   |-- crowdData.json
|   |   `-- stallsData.json
|   |-- pages/
|   |   |-- Dashboard.jsx
|   |   `-- Home.jsx
|   |-- utils/
|   |   |-- chat.js
|   |   |-- prediction.js
|   |   `-- routing.js
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
`-- README.md
```

## Team Roles

### Frontend Developer

- Build the UI using React and Tailwind CSS
- Create the home page, dashboard, map, and chat interface

### Logic / AI Developer

- Implement prediction logic
- Build queue estimation and route suggestion logic
- Handle assistant response rules

### Data Manager

- Create and maintain mock datasets
- Simulate crowd conditions and queue states

### Project Manager

- Maintain documentation and README
- Prepare final submission and presentation

## Hackathon Rules

- GitHub repository should be public
- Use only one branch
- Keep repository size below 1 MB
- Maintain clean and readable code
- Include a proper README

## Assumptions

- Crowd data is simulated
- Stadium map is predefined
- Users share location through the app
- Queue time is estimated using average service time

## Example Logic

```javascript
waitTime = peopleInQueue * avgServiceTime;
```

```javascript
if (people > 50) level = 'High';
else if (people > 20) level = 'Medium';
else level = 'Low';
```

## Getting Started

```bash
npm install
npm run dev
```

## Future Enhancements

- Connect live crowd sensor or camera feeds
- Add authentication and personalized seat details
- Integrate map APIs such as Leaflet
- Add multilingual assistant support