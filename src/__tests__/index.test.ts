import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../../dist/index.js');

describe('duration-ts', () => {
  it('should export Duration', () => {
    assert.ok(mod.Duration);
  });

  it('should export duration', () => {
    assert.ok(mod.duration);
  });
});
