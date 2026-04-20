# CrowdOS: Intelligent Venue Engine

## Problem Statement
Managing crowd congestion in large stadiums is a complex, dynamic challenge. Traditional signage and static routing fail to adapt to live surges, leading to bottlenecks, poor accessibility, and decreased fan satisfaction.

## Approach & Logic
CrowdOS uses real-time predictive modeling to route fans dynamically. Our custom AI decision engine calculates localized crowd density and wait times across all venue zones. Fans receive personalized routing via a live dashboard, dynamically shifting foot traffic to lower-pressure concourses.

## Architecture

User → React Frontend → Firebase Auth → Firestore DB → Analytics

- UI handles interaction
- Firebase Auth manages identity
- Firestore stores user preferences
- Analytics tracks usage patterns

## Tech Stack & How it works
This application functions as an Integrated Venue OS, utilizing a modern decoupled stack:
1. **Frontend:** React + Tailwind with mobile-first semantic HTML/ARIA compliant components.
2. **Predictive Engine:** Localized algorithms calculating surge offsets.
3. **AI Guidance:** Native `@google/genai` integration for conversational routing.
4. **Data Layer:** Cloud-synced user preferences and telemetry.

## Google Services Used
- **Google Gemini API (1.5 Flash):** Acts as the Matchday Assistant, processing real-time telemetry to provide hyper-localized navigational advice.
- **Firebase Firestore:** Persists user accessibility preferences and matchday goals for seamless cross-device continuity.
- **Firebase Analytics:** Logs routing patterns and bottleneck events for post-match analysis.
- **Firebase Auth:** Handles anonymous session continuity across the venue network.

## Extensibility & Assumptions
- Simulated crowd data representing active IoT sensor network inputs.
- Assumes indoor positioning approximation via ticket/gate scan proxy.
