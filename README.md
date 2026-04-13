# 🏟️ AI Crowd Intelligence & Smart Stadium Assistant

### **The Problem**
Stadium crowds change faster than static maps can respond. During halftime, entry, and exit windows, fans face congestion, long queues, and poor visibility into the fastest safe path.

### **The Solution**
The AI Crowd Intelligence & Smart Stadium Assistant is a real-time stadium guidance system with two synchronized interfaces: a fan-facing attendee app and an operations dashboard for venue staff. The system predicts crowd buildup, recommends lower-friction routes, and can instantly switch into evacuation guidance during emergencies.

---

### 🔥 **Key Innovations**

#### **1. Predictive Routing Engine**
Standard navigation relies strictly on distance. Our system adjusts path recommendations using simulated crowd conditions, event phase (e.g., halftime), and individual accessibility needs. It directs users dynamically to help avoid emerging stadium bottlenecks.

#### **2. Synchronized Live Control (`/ops`)**
During the demo, the `/ops` dashboard acts as the Venue Command Center. Changing the event phase or triggering an emergency here modifies the venue state in real time. The attendee dashboard (`/dashboard`) immediately responds with updated guidance, demonstrating how operations staff could redirect crowd flow.

#### **3. Immediate Emergency Response**
If the `/ops` dashboard triggers a Fire Alarm or Security Incident, every open attendee dashboard in the demo immediately reacts. Routine navigation (like finding food or washrooms) is locked or hidden, and the system instantly charts the safest path to the fan's closest exit zone.

#### **4. Gemini AI Chat Coach**
Powered by **Google Gemini 1.5 Flash**, the platform features a conversational AI Assistant completely aware of the fan's current in-stadium zone and live wait times. Ask *"Where's the quickest place to grab a hotdog?"* and the AI will analyze current stall queues to provide the best recommendation.

#### **5. ADA-Compliant "Accessible Mode"**
The routing system respects accessibility. When active, the pathfinding engine drops staircases from its traversal graph, ensuring fans are guided safely to elevators and ramps.

---

### 💻 **Technical Architecture & Demo Setup**
*   **Frontend Data & Style:** React.js + Vite, styled with custom CSS and Tailwind utilities for a premium "scoreboard" aesthetic.
*   **AI Integration:** `@google/genai` SDK, prompted with local JSON representations of the stadium state and real-time queue wait times.
*   **Demo Synchronization:** Employs a cross-tab `localStorage` event listener hook. This creates a highly reliable real-time presentation flow where actions on the `/ops` screen instantly update the attendee app in a separate browser window, simulating backend broadcast infrastructure perfectly without the overhead.

### 🌟 **The Impact**
The project helps fans move faster and enjoy the event more. Concurrently, it helps venue operators maintain operational clarity and respond more effectively during sudden crowd surges or emergency scenarios, ultimately improving venue safety response.

---
### 🚀 **Getting Started**
Ensure you have created a `.env` file containing your Google Gemini API Key:
```text
VITE_GEMINI_API_KEY=your_key_here
```

Then install dependencies and start the dev server:
```bash
npm install
npm run dev
```

For the ideal demonstration, open `http://localhost:5173/dashboard` in a mobile-sized browser window, and `http://localhost:5173/ops` in a separate tab or screen to run the synchronized simulation.
