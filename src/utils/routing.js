import { getCrowdLevel } from './prediction';

const destinationMap = {
  seat: {
    title: 'Seat Route',
    defaultZone: 'West Concourse',
    steps: ['Enter through South Gate', 'Take the west corridor', 'Use Section B stairs'],
  },
  food: {
    title: 'Food Route',
    defaultZone: 'West Concourse',
    steps: ['Use the lower concourse', 'Avoid Food Court center lane', 'Head to Stall B'],
  },
  washroom: {
    title: 'Washroom Route',
    defaultZone: 'East Concourse',
    steps: ['Cross via central walkway', 'Turn right at Gate 3', 'Use the family washroom block'],
  },
  exit: {
    title: 'Fastest Exit',
    defaultZone: 'South Gate',
    steps: ['Move toward the south aisle', 'Skip North Gate congestion', 'Exit via South Gate'],
  },
};

export function getBestRoute(destination, crowdZones) {
  const template = destinationMap[destination] ?? destinationMap.seat;
  const calmestZone = [...crowdZones].sort((a, b) => a.people - b.people)[0];
  const preferredZone =
    crowdZones.find((zone) => zone.zone === template.defaultZone) ?? calmestZone;

  return {
    ...template,
    recommendedZone: preferredZone.zone,
    crowdLevel: getCrowdLevel(preferredZone.people),
  };
}
