# 🏟️ AI Crowd Intelligence & Smart Stadium Assistant

### **The Problem: Reactive Management**
To tackle the logistical chaos of a large-scale stadium, the solution must shift from **reactive management** (fixing crowds once they form) to **predictive orchestration** (preventing the bottleneck before it happens). Stadium crowds change faster than static maps can respond. During halftime, entry, and exit windows, fans face congestion, long queues, and poor visibility into the fastest safe path.

### **The Solution: Integrated Venue OS**
The AI Crowd Intelligence & Smart Stadium Assistant is an **Integrated Venue OS** that combines computer vision principles, IoT concepts, and edge computing to turn the physical venue into a responsive environment. It features two synchronized interfaces: a fan-facing attendee app and an operations dashboard for venue staff.

---

### 🌐 **The "Venue OS" Strategy**

#### **1. Predictive Crowd Flow & Wayfinding**
Instead of static signs, the venue uses **Dynamic Spatial Routing**.
*   **Computer Vision Overlays:** Utilizing existing security camera feeds, AI models calculate crowd density in specific zones.
*   **The "Heat-Map" Redirection:** If the North Gate is at 90% capacity while the South Gate is at 20%, the system automatically updates to show the "Fastest Path," not just the "Nearest Path."
*   **Post-Event Phased Egress:** To prevent the dangerous "crush" after the final whistle, the system can provide staggered exit instructions.

#### **2. The "Virtual Queue" for Amenities**
Waiting in line for food or restrooms is the primary pain point of the fan experience.
*   **Mobile Ordering & Locker Pickup:** Fans order food via the app and retrieve it from designated thermal-controlled lockers, eliminating lines entirely.
*   **Restroom "Wait-Times" Dashboard:** IoT sensors track occupancy, feeding real-time wait times to the attendee dashboard so fans always know which concession or restroom to visit.

#### **3. Real-Time Logistics & Coordination**
The Command Center (via our `/ops` dashboard) acts as a Digital Twin of the event to make split-second decisions.

| Challenge | Technical Solution | Real-World Impact |
| :--- | :--- | :--- |
| **Medical/Security Incidents** | **Precision Positioning** | Staff are equipped with UWB tags. The closest responder is dispatched via automated routing, cutting response times. |
| **Connectivity Dead Zones** | **Private 5G/Wi-Fi 6E** | Ensuring high-density networks for "Virtual Queues" and "Live Stats" work flawlessly. |
| **Inventory Shortages** | **Automated Replenishment** | Smart scales alert the warehouse to restock *before* a product runs out. |

#### **4. Implementation Strategy (The "Actually Works" Part)**
A solution like this fails if it's too complex for the average fan. 
1.  **Phase 1: Integration.** Sync the ticket barcode with the stadium app. This acts as the "Digital Passport" for entry, payment, and seat-finding.
2.  **Phase 2: Incentivization.** Use "Gamified Egress." Offer 15% discounts at the team store to fans who stay in their seats for 10 minutes after the game, thinning the initial exit surge.
3.  **Phase 3: Feedback Loop.** Use sentiment analysis on social media geofenced to the stadium to identify "blind spots" that sensors might miss.

#### **The Data Engine**
The backbone of this routing logic is driven by monitoring crowd flow based on the principles of fluid dynamics:

`FlowRate (Q) = ρ * v * w`

Where:
* `Q` = People passing a point per second.
* `ρ` = Density (people per square meter).
* `v` = Velocity of movement.
* `w` = Width of the walkway.

By monitoring these variables, the system can trigger an "Alert" to staff the moment `ρ` (density) exceeds a safety threshold, well before a crowd becomes a "crush."

---

### 🔥 **Prototype Implementations**
While the broader Venue OS strategy details the production vision, this codebase implements the following core Proof-of-Concept features:

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
