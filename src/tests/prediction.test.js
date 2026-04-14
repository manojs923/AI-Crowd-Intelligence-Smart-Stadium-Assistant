import { describe, it, expect } from 'vitest';
import { getCrowdLevel, estimateWaitTime, getPhaseMultiplier } from '../utils/prediction';

describe('Crowd Prediction Logic', () => {
  it('should return High congestion for >80 people', () => {
    expect(getCrowdLevel(85)).toBe('High');
  });

  it('should return Low congestion for <40 people', () => {
    expect(getCrowdLevel(20)).toBe('Low');
  });

  it('should return Medium congestion for 40-79 people', () => {
    expect(getCrowdLevel(50)).toBe('Medium');
  });
});

describe('Queue Estimation Logic', () => {
  it('should calculate wait time properly', () => {
    // wait time = queueLength * avgServiceTime
    expect(estimateWaitTime(10, 2)).toBe(20);
    expect(estimateWaitTime(0, 5)).toBe(0);
  });
});

describe('Event Phase Data Multipliers', () => {
  it('should return a multiplier > 1 during Halftime (surge)', () => {
    expect(getPhaseMultiplier('Halftime')).toBeGreaterThan(1);
  });
  
  it('should return a multiplier equal to 1 during First Half (playing)', () => {
    expect(getPhaseMultiplier('First Half')).toEqual(1);
  });
});
