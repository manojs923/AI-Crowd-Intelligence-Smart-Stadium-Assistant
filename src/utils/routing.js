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
    title: 'Seat Route',
    fallbackZone: 'West Concourse',
  },
  food: {
    title: 'Food Route',
    fallbackZone: 'West Concourse',
  },
  washroom: {
    title: 'Washroom Route',
    fallbackZone: 'East Concourse',
  },
  exit: {
    title: 'Fastest Exit',
    fallbackZone: 'South Gate',
  },
};

export function getGoalDestination(goal) {
  return goalToDestination[goal] ?? 'seat';
}

export function getBestRoute(destination, crowdZones, userProfile) {
  const template = destinationMap[destination] ?? destinationMap.seat;
  const calmestZone = [...crowdZones].sort((a, b) => a.people - b.people)[0];
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
      `Avoid the busiest gate cluster`,
      'Exit using South Gate',
    ],
  };

  return {
    title: template.title,
    recommendedZone: preferredZone.zone,
    crowdLevel: getCrowdLevel(preferredZone.people),
    steps: stepSets[destination] ?? stepSets.seat,
  };
}
