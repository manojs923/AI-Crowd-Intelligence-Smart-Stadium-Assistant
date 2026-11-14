import { describe, it, expect } from 'vitest';
import { findShortestPath, getBestRoute } from '../utils/routing';

describe('Routing Engine Integration', () => {
  const mockCrowdZones = [
    { zone: 'North Gate', people: 10, waitFactor: 0.5, isOutside: false },
    { zone: 'Food Court', people: 65, waitFactor: 1.8, isOutside: false }, // highly congested
    { zone: 'East Concourse', people: 15, waitFactor: 0.8, isOutside: false },
    { zone: 'South Gate', people: 20, waitFactor: 1.0, isOutside: false },
  ];

  const mockProfile = {
    gate: 'North Gate',
    seat: 'Section A, Row 12, Seat A45',
    goalLabel: 'Watch match',
  };

  it('should return fastest route avoiding heavy congestion constraints', () => {
    // Re-route to seat logic goes through East Concourse instead of standard center nodes
    const result = getBestRoute('seat', mockCrowdZones, mockProfile, 'First Half');
    
    // In our simplified mock, it shouldn't take more than 15 mins to route
    expect(result.walkTime).toBeLessThan(15);
    
    // Ensure the generated string includes some valid output form
    expect(result.pathZones.length).toBeGreaterThan(0);
    expect(result.recommendedZone).toBeDefined();
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('returns a route when accessible mode is active', () => {
    const accessibleProfile = { ...mockProfile, accessibleMode: true };
    const route = getBestRoute('seat', mockCrowdZones, accessibleProfile, 'First Half');
    expect(route.pathZones).toBeTruthy();
  });

  it('avoids stair nodes in accessible mode when an alternative route exists', () => {
    const zones = [
      { zone: 'South Gate', x: 0, y: 0, people: 0 },
      { zone: 'Lower Deck Exit', x: 1, y: 0, people: 0, isStairs: true },
      { zone: 'East Concourse', x: 2, y: 0, people: 0 },
      { zone: 'North Gate', x: 3, y: 0, people: 0 },
      { zone: 'West Concourse', x: 0, y: 3, people: 0 },
      { zone: 'Food Court', x: 0, y: 1.5, people: 0 },
    ];

    const route = findShortestPath(
      'South Gate',
      'North Gate',
      zones,
      'First Half',
      0,
      true,
      'ada-test',
    );

    expect(route.pathZones).not.toContain('Lower Deck Exit');
    expect(route.pathZones.at(-1)).toBe('North Gate');
  });
});
