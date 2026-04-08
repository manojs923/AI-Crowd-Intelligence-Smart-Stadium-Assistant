import { getCrowdLevel } from './prediction';

const seatZoneMap = {
  'Section A': 'North Gate',
  'Section B': 'West Concourse',
  'Section C': 'East Concourse',
};

const goalToDestination = {
  seat: 'seat',
  food: 'food',
  explore: 'washroom',
};

const destinationMap = {
  seat: {
    title: 'Smart Route (Simulated)',
    fallbackZone: 'West Concourse',
  },
  food: {
    title: 'Crowd-Aware Food Path',
    fallbackZone: 'Food Court',
  },
  washroom: {
    title: 'Crowd-Aware Washroom Path',
    fallbackZone: 'East Concourse',
  },
  exit: {
    title: 'Smart Exit Recommendation',
    fallbackZone: 'South Gate',
  },
};

function dedupePath(path) {
  return path.filter((zone, index) => zone && path.indexOf(zone) === index);
}

export function getGoalDestination(goal) {
  return goalToDestination[goal] ?? 'seat';
}

export function getBestRoute(destination, crowdZones, userProfile) {
  const template = destinationMap[destination] ?? destinationMap.seat;
  const calmestZone = [...crowdZones].sort((a, b) => a.people - b.people)[0];
  const busiestZone = [...crowdZones].sort((a, b) => b.people - a.people)[0];
  const seatZone = userProfile?.seat ? seatZoneMap[userProfile.seat] : null;
  const preferredTarget = destination === 'seat' && seatZone ? seatZone : template.fallbackZone;
  const preferredZone = crowdZones.find((zone) => zone.zone === preferredTarget) ?? calmestZone;
  const startGate = userProfile?.gate ?? 'South Gate';
  const seatLabel = userProfile?.seat ?? 'Section B';

  const stepSets = {
    seat: [
      `Enter through ${startGate}`,
      `Move via ${calmestZone.zone}`,
      `Use the nearest access path to ${seatLabel}`,
    ],
    food: [
      `Start from ${startGate}`,
      `Use ${calmestZone.zone} to avoid the heaviest flow`,
      `Head toward ${preferredZone.zone} for the food zone`,
    ],
    washroom: [
      `Leave ${seatLabel} using the calmer aisle`,
      `Cross through ${calmestZone.zone}`,
      `Use the washroom block near ${preferredZone.zone}`,
    ],
    exit: [
      `Return toward ${calmestZone.zone}`,
      `Avoid ${busiestZone.zone}`,
      'Exit using South Gate',
    ],
  };

  const pathZones = {
    seat: dedupePath([startGate, calmestZone.zone, preferredZone.zone]),
    food: dedupePath([startGate, calmestZone.zone, preferredZone.zone]),
    washroom: dedupePath([seatZone ?? startGate, calmestZone.zone, preferredZone.zone]),
    exit: dedupePath([seatZone ?? calmestZone.zone, calmestZone.zone, 'South Gate']),
  };

  return {
    title: template.title,
    recommendedZone: preferredZone.zone,
    crowdLevel: getCrowdLevel(preferredZone.people),
    steps: stepSets[destination] ?? stepSets.seat,
    pathZones: pathZones[destination] ?? pathZones.seat,
  };
}
