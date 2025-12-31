import { describe, it, expect } from 'vitest';
import { createProductSchema } from '../lib/validators';

describe('createProductSchema', () => {
  it('accepts valid input', () => {
    const valid = {
      title: 'Steel Rebar 12mm',
      description: 'High quality steel rebar for construction',
      priceUsd: 500,
      incoterm: 'FOB'
    };
    const parsed = createProductSchema.parse(valid);
    expect(parsed.title).toBe(valid.title);
  });

  it('rejects invalid input (short title)', () => {
    const bad = { title: 'ab', description: 'short', priceUsd: -10, incoterm: 'FOB' };
    expect(() => createProductSchema.parse(bad)).toThrow();
  });
});
