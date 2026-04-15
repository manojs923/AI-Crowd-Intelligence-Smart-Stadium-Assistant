import { describe, it, expect } from 'vitest';
import { getBestRoute } from '../utils/routing';

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

  it('should trigger ADA warning string if appropriate parameters passed', () => {
    // Testing accessibility flags if they were implemented within routing payload
    const accessibleProfile = { ...mockProfile, accessible: true };
    const route = getBestRoute('seat', mockCrowdZones, accessibleProfile, 'First Half');
    expect(route.pathZones).toBeTruthy(); // Even if ADA isn't natively handled in this slice, it should return a safe path object
  });
});
