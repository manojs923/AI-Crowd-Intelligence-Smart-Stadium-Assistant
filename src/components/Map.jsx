import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getBestRoute } from '../utils/routing';
import { getCrowdColor, getCrowdLevel } from '../utils/prediction';

const destinations = [
  { key: 'seat', label: 'Seat' },
  { key: 'food', label: 'Food' },
  { key: 'washroom', label: 'Washroom' },
  { key: 'exit', label: 'Best Exit' },
  { key: 'metro', label: 'Metro 🚇' },
  { key: 'bus', label: 'Bus 🚌' },
  { key: 'cab', label: 'Cab 🚖' },
  { key: 'parking', label: 'Parking 🅿️' },
];

const viewBoxWidth = 100;
const viewBoxHeight = 100;

function toPoint(zone) {
  return `${zone.x},${zone.y}`;
}

function getPathDefinition(pathZones, crowdZones) {
  const resolvedZones = pathZones
    .map((name) => crowdZones.find((zone) => zone.zone === name))
    .filter(Boolean);

  if (!resolvedZones.length) return '';

  return resolvedZones.map((zone, index) => `${index === 0 ? 'M' : 'L'} ${toPoint(zone)}`).join(' ');
}

export default function Map({ crowdZones, destination, onDestinationChange, userProfile, navigationStatus, phase, isEmergency }) {
  const route = getBestRoute(destination, crowdZones, userProfile, phase);
  const [selectedZone, setSelectedZone] = useState(crowdZones[0]?.zone ?? 'North Gate');

  useEffect(() => {
    setSelectedZone(route.recommendedZone);
  }, [route.recommendedZone]);

  const activeZone = crowdZones.find((zone) => zone.zone === selectedZone) ?? crowdZones[0];
  const zoneWait = Math.max(2, Math.round((activeZone?.waitFactor ?? 1) * 10));
  const zoneRecommendation =
    getCrowdLevel(activeZone?.people ?? 0) === 'High' ? 'Avoid for now' : 'Good path to use';

  const routePath = useMemo(
    () => getPathDefinition(route.pathZones, crowdZones),
    [crowdZones, route.pathZones],
  );
  
  const currentZone = crowdZones.find((zone) => zone.zone === userProfile.gate) ?? crowdZones[0];

  // Logic for YOU indicator target position
  const targetZoneName = (navigationStatus === 'navigating' || navigationStatus === 'rerouting') 
     && route.pathZones.length > 1 
       ? route.pathZones[1] // Move one step along the active path segments
       : currentZone.zone;
       
  const targetZone = crowdZones.find((z) => z.zone === targetZoneName) ?? currentZone;
  const dotTranslateX = targetZone.x - currentZone.x;
  const dotTranslateY = targetZone.y - currentZone.y;

  return (
    <section className="glass-card rounded-[1.75rem] border-white/10 bg-white/5 p-5 shadow-glow">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="section-label text-[11px] font-semibold uppercase text-orange-200">
            Dynamic Spatial Routing
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase leading-none text-white">
            Crowd-aware path guidance
          </h2>
          <p className="mt-2 text-sm font-semibold text-lime-300 italic tracking-wide">
            "Like Google Maps, but for stadium crowds — optimized in real-time."
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Starting from {userProfile.gate}, optimized for {userProfile.seat} and{' '}
            {userProfile.goalLabel.toLowerCase()}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
          {destinations.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={isEmergency}
              aria-label={`Route to ${item.label}`}
              onClick={() => onDestinationChange(item.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] transition focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                destination === item.key
                  ? (isEmergency ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-300' : 'bg-lime-300 text-slate-950')
                  : 'bg-slate-950/70 text-slate-300 hover:bg-white/10 hover:text-white'
              } ${isEmergency && destination !== item.key ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-4 text-white">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#09111d,#09111d_18px,#0d1c2e_19px)] opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(190,242,100,0.12),transparent_34%),radial-gradient(circle_at_80%_24%,rgba(56,189,248,0.12),transparent_18%)]" />

          <div className="relative z-10 mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className={`rounded-[1rem] border px-4 py-3 transition-colors duration-500 flex flex-col justify-between ${
              navigationStatus === 'rerouting' ? 'border-purple-500/25 bg-purple-500/10' : 'border-sky-400/25 bg-sky-400/10'
            }`}>
              <div>
                <p className={`section-label text-[10px] font-semibold uppercase ${navigationStatus === 'rerouting' ? 'text-purple-300' : 'text-sky-300'}`}>
                  Fastest recommendation
                </p>
                <p className="mt-2 text-lg font-bold text-white">{route.recommendedZone}</p>
                <p className={`mt-1 text-sm font-semibold ${navigationStatus === 'rerouting' ? 'text-purple-200' : 'text-sky-200'}`}>
                  ETA: {route.walkTime} min via {route.recommendedZone}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-[10px] font-medium text-sky-200">
                   💡 Avoids 65% congestion ahead
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-100">
              <span className="rounded-full bg-lime-400 px-3 py-1 text-slate-950">Low</span>
              <span className="rounded-full bg-amber-400 px-3 py-1 text-slate-950">Medium</span>
              <span className="rounded-full bg-rose-500 px-3 py-1 text-white">High</span>
            </div>
          </div>

          <div className="relative z-10 overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/40 p-2">
            <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="h-[380px] w-full">
              <defs>
                <linearGradient id="routeGlow" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="routeGlowReroute" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#a78bfa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
                </linearGradient>
                <filter id="nodeGlow">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect x="4" y="4" width="92" height="92" rx="8" fill="none" stroke="rgba(255,255,255,0.15)" />
              <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" />

              {/* Stadium Structural Boundary */}
              <path
                d="M 12,24 C 12,14 88,14 88,24 L 88,76 C 88,86 12,86 12,76 Z"
                fill="rgba(255,255,255,0.02)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.3"
                strokeDasharray="1.5 1.5"
              />
              <text x="50" y="20" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="2.8" fontWeight="700" letterSpacing="0.2em">
                STADIUM CONCOURSE
              </text>
              <text x="50" y="8" textAnchor="middle" fill="rgba(56,189,248,0.4)" fontSize="2.2" fontWeight="700" letterSpacing="0.1em">
                CITY INFRASTRUCTURE
              </text>
              <text x="50" y="94" textAnchor="middle" fill="rgba(56,189,248,0.4)" fontSize="2.2" fontWeight="700" letterSpacing="0.1em">
                CITY INFRASTRUCTURE
              </text>

              {routePath ? (
                <>
                  <motion.path 
                    initial={false}
                    animate={{ d: routePath }}
                    fill="none" 
                    stroke="rgba(255,255,255,0.08)" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                    <motion.path
                      id="routePath"
                      initial={false}
                      animate={{ d: routePath }}
                      fill="none"
                      stroke={navigationStatus === 'rerouting' ? "url(#routeGlowReroute)" : "url(#routeGlow)"}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={routePath.includes('M') ? "5 5" : "10 6"} // Fallback hack if we wanted dashed for outside, but since we rely on animated offset we leave array intact conceptually.
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                    <animate attributeName="stroke-dashoffset" from="0" to="-64" dur="2.4s" repeatCount="indefinite" />
                  </motion.path>
                  <circle r="1.7" fill={navigationStatus === 'rerouting' ? "#c4b5fd" : "#bae6fd"} filter="url(#nodeGlow)">
                    <animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#routePath" />
                    </animateMotion>
                  </circle>
                  <circle r="1.2" fill={navigationStatus === 'rerouting' ? "#a78bfa" : "#38bdf8"} filter="url(#nodeGlow)">
                    <animateMotion dur="3.4s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#routePath" />
                    </animateMotion>
                  </circle>
                </>
              ) : null}

              {currentZone ? (
                <motion.g
                  initial={false}
                  animate={{ x: dotTranslateX, y: dotTranslateY }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                >
                  <circle cx={currentZone.x} cy={currentZone.y} r="5.6" fill="#38bdf8" opacity="0.18">
                    <animate attributeName="r" values="4.8;6.8;4.8" dur="2.1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={currentZone.x} cy={currentZone.y} r="2.6" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 7px white)' }} />
                  <text x={currentZone.x + 3} y={currentZone.y - 3} fill="#bae6fd" fontSize="3.5" fontWeight="700">
                    📍 You are here
                  </text>
                </motion.g>
              ) : null}

              {crowdZones.map((spot) => {
                const isActive = activeZone?.zone === spot.zone;
                const isOutside = spot.isOutside;
                const level = getCrowdLevel(spot.people);
                const crowdColorClass = getCrowdColor(level);
                const fillColor =
                  crowdColorClass === 'bg-rose-500'
                    ? '#f43f5e'
                    : crowdColorClass === 'bg-amber-400'
                      ? '#fbbf24'
                      : '#84cc16';

                return (
                  <g
                    key={spot.zone}
                    onClick={() => setSelectedZone(spot.zone)}
                    className="cursor-pointer transition-all duration-500"
                  >
                    <title>{`${spot.zone} - Crowd: ${level} - ${spot.people} people`}</title>
                    
                    {/* Background Pulses */}
                    <circle cx={spot.x} cy={spot.y} r={isOutside ? "6" : "7"} fill={fillColor} opacity="0.12">
                      <animate attributeName="r" values={isOutside ? "5;7;5" : "6;8.5;6"} dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    
                    <circle cx={spot.x} cy={spot.y} r={isOutside ? "3.5" : "4.4"} fill={fillColor} opacity="0.22">
                      <animate attributeName="r" values={isOutside ? "3;4.5;3" : "4;5.2;4"} dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Central Node */}
                    {isOutside ? (
                      <rect
                        x={spot.x - (isActive ? 2.8 : 2.2)}
                        y={spot.y - (isActive ? 2.8 : 2.2)}
                        width={isActive ? 5.6 : 4.4}
                        height={isActive ? 5.6 : 4.4}
                        rx="1"
                        fill={isActive ? '#ffffff' : fillColor}
                        stroke="#38bdf8"
                        strokeWidth="0.6"
                        strokeDasharray="1.5 1.5"
                        style={{ filter: isActive ? 'drop-shadow(0 0 8px white)' : 'drop-shadow(0 0 6px rgba(56,189,248,0.5))' }}
                      />
                    ) : (
                      <circle
                        cx={spot.x}
                        cy={spot.y}
                        r={isActive ? '2.8' : '2.2'}
                        fill={isActive ? '#ffffff' : fillColor}
                        style={{ filter: isActive ? 'drop-shadow(0 0 8px white)' : 'drop-shadow(0 0 6px rgba(255,255,255,0.35))' }}
                      />
                    )}

                    {/* Emoji rendering directly in the label to prevent node glitches */}
                    <text
                      x={spot.x}
                      y={spot.y + 7.5}
                      textAnchor="middle"
                      fill={isOutside ? "#bae6fd" : "#f8fafc"}
                      fontSize={isOutside ? "2.8" : "3.1"}
                      fontWeight="700"
                    >
                      {spot.icon ? `${spot.zone} ${spot.icon}` : spot.zone}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/10 bg-slate-950/75 px-3 py-2 text-lg text-white">
              🕹️
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-3xl uppercase leading-none text-white">{route.title}</h3>
            
            {route.nudge && (
              <div className="mt-3 mb-4 rounded-xl border border-lime-500/20 bg-lime-500/10 p-3">
                 <p className="text-sm font-semibold text-lime-200 flex items-center gap-2">
                   🧠 AI Insight: {route.nudge}
                 </p>
              </div>
            )}
            
            <p className="mt-2 text-sm text-slate-300">
              This prototype simulates indoor position and updates the path using live crowd conditions.
            </p>
            <div className="mt-4 space-y-3">
              {route.steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-[1.25rem] bg-slate-950/70 p-3 transition-all duration-500 ease-in-out"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-300 font-bold text-slate-950">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm font-medium text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-orange-300/15 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-5 text-white shadow-lg">
            <p className="section-label text-[10px] font-semibold uppercase text-orange-200">
              Prototype note
            </p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-[0.06em]">
              Indoor positioning simulated
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Real deployment can combine Wi-Fi, Bluetooth beacons, and QR checkpoints for near-accurate navigation and rerouting.
            </p>
            <p className="mt-4 text-sm text-slate-200">Crowd: {getCrowdLevel(activeZone?.people ?? 0)}</p>
            <p className="mt-2 text-sm text-slate-200">Wait Time: {zoneWait} mins</p>
            <p className="mt-2 text-sm text-slate-200">Suggestion: {zoneRecommendation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
