import { describe, expect, it } from 'vitest';
import { currentDemoUser, demoUsers } from '../../shared/data/demo';
import { rankCandidates, scoreCompatibility } from './matching';

describe('scoreCompatibility', () => {
  it('returns a bounded deterministic score with explanations', () => {
    const result = scoreCompatibility(currentDemoUser, demoUsers[1]!);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.explanation.length).toBeGreaterThan(0);
  });

  it('ranks candidates by score', () => {
    const ranked = rankCandidates(currentDemoUser, demoUsers.slice(1));
    expect(ranked[0]!.compatibility.score).toBeGreaterThanOrEqual(
      ranked[ranked.length - 1]!.compatibility.score
    );
  });
});
