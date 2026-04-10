import { getCrowdLevel, getForecastedCrowd, generateBehavioralNudge } from './prediction';

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
    title: 'Smart Route (Graph Computed)',
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
  metro: {
    title: 'Metro Route',
    fallbackZone: 'Metro',
  },
  bus: {
    title: 'Bus Stop Route',
    fallbackZone: 'Bus Stop',
  },
  cab: {
    title: 'Cab Zone Route',
    fallbackZone: 'Cab Zone',
  },
  parking: {
    title: 'Parking Route',
    fallbackZone: 'Parking',
  },
};

const graphConnections = {
  'North Gate': ['West Concourse', 'East Concourse', 'Road 1'],
  'South Gate': ['West Concourse', 'Food Court', 'Lower Deck Exit', 'Cab Zone', 'Parking'],
  'East Concourse': ['North Gate', 'Food Court', 'Lower Deck Exit'],
  'West Concourse': ['North Gate', 'Food Court', 'South Gate'],
  'Food Court': ['West Concourse', 'East Concourse', 'South Gate', 'Lower Deck Exit'],
  'Lower Deck Exit': ['East Concourse', 'Food Court', 'South Gate'],
  'Road 1': ['North Gate', 'Metro', 'Bus Stop'],
  'Metro': ['Road 1'],
  'Bus Stop': ['Road 1'],
  'Cab Zone': ['South Gate'],
  'Parking': ['South Gate'],
};

function getDistance(zoneA, zoneB) {
  const dx = zoneA.x - zoneB.x;
  const dy = zoneA.y - zoneB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Extensible pathfinding logic updated to support predictive phase analytics, load balancing and ADA routing
export function findShortestPath(startZoneName, targetZoneName, crowdZones, phase = 'First Half', crowdWeight = 0.5, accessibleMode = false, uid = "default") {
  if (startZoneName === targetZoneName) {
    return { pathZones: [startZoneName], walkTime: 0 };
  }

  const nodes = new Set(crowdZones.map(z => z.zone));
  const distances = {};
  const previous = {};
  const queue = [];

  for (const node of nodes) {
    distances[node] = Infinity;
    previous[node] = null;
    queue.push(node);
  }

  distances[startZoneName] = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => distances[a] - distances[b]);
    const current = queue.shift();

    if (current === targetZoneName) break;
    if (distances[current] === Infinity) break;

    const currentZone = crowdZones.find(z => z.zone === current);
    const neighbors = graphConnections[current] || [];

    for (const neighbor of neighbors) {
      if (!queue.includes(neighbor)) continue;

      const neighborZone = crowdZones.find(z => z.zone === neighbor);
      
      // ADA Access Constraint
      if (accessibleMode && neighborZone.isStairs) {
        continue;
      }
      
      const distance = getDistance(currentZone, neighborZone);
      
      // Cost function = physical distance + (crowd_weight * FORECASTED_crowd_level)
      // This routes users around upcoming congestion, not just current congestion.
      const forecastedCrowd = getForecastedCrowd(neighborZone.zone, neighborZone.people, phase);
      
      // Anti-Herding Algorithmic Balance
      // Applying a deterministic micro-penalty across borderline routes based on user UUID
      let herdPenalty = 0;
      const hashData = uid ? uid.toString() : "stadium";
      const userHash = (hashData.charCodeAt(0) + neighborZone.zone.length) % 10;
      // Re-route ~30% of users over heavily populated nodes dynamically to stagger queues
      if (userHash < 3) {
         herdPenalty = 5; 
      }

      const cost = distance + (crowdWeight * forecastedCrowd) + herdPenalty;
      
      const alt = distances[current] + cost;

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }

  const path = [];
  let u = targetZoneName;
  while (previous[u]) {
    path.unshift(u);
    u = previous[u];
  }
  
  if (path.length > 0) {
    path.unshift(startZoneName);
  } else {
    // No path found fallback
    return { pathZones: [startZoneName, targetZoneName], walkTime: 2 };
  }

  // Calculate total walk time
  let totalWalkTime = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const from = crowdZones.find(z => z.zone === path[i]);
    const to = crowdZones.find(z => z.zone === path[i+1]);
    const dist = getDistance(from, to);
    totalWalkTime += Math.max(2, Math.round(dist / 14));
  }

  return { pathZones: path, walkTime: totalWalkTime };
}

export function getGoalDestination(goal) {
  return goalToDestination[goal] ?? 'seat';
}

export function getBestRoute(destination, crowdZones, userProfile, phase = 'First Half') {
  const template = destinationMap[destination] ?? destinationMap.seat;
  const startGate = userProfile?.gate ?? 'South Gate';
  const seatZone = userProfile?.seat ? seatZoneMap[userProfile.seat] : null;
  
  const accessibleMode = userProfile?.accessibleMode ?? false;
  const uid = userProfile?.id ?? "uuid-random";

  // Determine starting and target nodes based on intent
  let startNode = startGate;
  let targetNode = template.fallbackZone;

  if (destination === 'seat') {
    startNode = startGate;
    targetNode = seatZone ?? template.fallbackZone;
  } else if (destination === 'washroom') {
    startNode = seatZone ?? startGate;
  } else if (destination === 'exit') {
    startNode = seatZone ?? startGate;
    // targetNode dynamically calculates? Wait, for 'exit', since there are multiple exits
    // Dijkstra could target all exits and find minimum. 
    // Since we explicitly want best exit dynamically, we can loop over exits.
    const validExits = ['North Gate', 'South Gate'];
    let bestExitNode = validExits[0];
    let bestCost = Infinity;

    validExits.forEach(exitGate => {
       const { pathZones, walkTime } = findShortestPath(startNode, exitGate, crowdZones, phase, 0.5, accessibleMode, uid);
       const exitZone = crowdZones.find(z => z.zone === exitGate);
       const gateForecast = getForecastedCrowd(exitGate, exitZone.people, phase);
       const routeCost = walkTime + gateForecast; 
       if (routeCost < bestCost) {
          bestCost = routeCost;
          bestExitNode = exitGate;
       }
    });
    targetNode = bestExitNode;

  } else if (destination === 'food') {
    startNode = startGate;
  } else if (['metro', 'bus', 'cab', 'parking'].includes(destination)) {
    startNode = seatZone ?? startGate;
    targetNode = template.fallbackZone;
  }

  // Use the new pathfinding system mathematically balanced via predictions
  const { pathZones, walkTime } = findShortestPath(startNode, targetNode, crowdZones, phase, 0.5, accessibleMode, uid);

  // Derive dynamic instructions from the path
  const steps = [];
  if (pathZones.length > 0) {
    steps.push(`Start from ${pathZones[0]}`);
    if (pathZones.length > 2) {
      steps.push(`Navigate through ${pathZones.slice(1, -1).join(' -> ')}`);
    }
    steps.push(`Arrive safely at ${pathZones[pathZones.length - 1]}`);
  }

  const recommendedZone = pathZones[pathZones.length - 1] ?? targetNode;
  const destinationCrowdLevel = crowdZones.find(z => z.zone === recommendedZone)?.people ?? 0;
  const crowdLevelWord = getCrowdLevel(destinationCrowdLevel);
  const behavioralNudge = generateBehavioralNudge(pathZones, walkTime, crowdLevelWord);

  return {
    title: template.title,
    recommendedZone,
    crowdLevel: crowdLevelWord,
    steps,
    pathZones,
    walkTime,
    nudge: behavioralNudge,
  };
}
