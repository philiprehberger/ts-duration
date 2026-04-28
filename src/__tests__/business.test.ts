import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../../dist/index.js');
const { Duration, duration } = mod;

const HOUR = 3_600_000;

describe('Duration.businessDays', () => {
  it('counts a single full work day', () => {
    // Mon 2026-01-05 09:00 → 17:00 local
    const start = new Date(2026, 0, 5, 9, 0, 0);
    const end = new Date(2026, 0, 5, 17, 0, 0);
    const d = Duration.businessDays(start, end);
    assert.equal(d.toMilliseconds(), 8 * HOUR);
  });

  it('clamps before workStart on the start day', () => {
    // Mon 2026-01-05 06:00 → 12:00 local — only 09:00..12:00 counts
    const start = new Date(2026, 0, 5, 6, 0, 0);
    const end = new Date(2026, 0, 5, 12, 0, 0);
    const d = Duration.businessDays(start, end);
    assert.equal(d.toMilliseconds(), 3 * HOUR);
  });

  it('clamps after workEnd on the end day', () => {
    // Mon 2026-01-05 14:00 → 22:00 local — only 14:00..17:00 counts
    const start = new Date(2026, 0, 5, 14, 0, 0);
    const end = new Date(2026, 0, 5, 22, 0, 0);
    const d = Duration.businessDays(start, end);
    assert.equal(d.toMilliseconds(), 3 * HOUR);
  });

  it('skips weekends across a cross-week range', () => {
    // Fri 2026-01-02 09:00 → Mon 2026-01-05 17:00
    // Fri full (8h) + Mon full (8h) = 16h. Sat/Sun excluded.
    const start = new Date(2026, 0, 2, 9, 0, 0);
    const end = new Date(2026, 0, 5, 17, 0, 0);
    const d = Duration.businessDays(start, end);
    assert.equal(d.toMilliseconds(), 16 * HOUR);
  });

  it('returns zero for a range entirely on the weekend', () => {
    const start = new Date(2026, 0, 3, 10, 0, 0); // Sat
    const end = new Date(2026, 0, 4, 16, 0, 0); // Sun
    const d = Duration.businessDays(start, end);
    assert.equal(d.toMilliseconds(), 0);
  });

  it('handles mid-day start and mid-day end across a full week', () => {
    // Mon 2026-01-05 11:00 → Fri 2026-01-09 15:00
    // Mon: 11→17 = 6h
    // Tue, Wed, Thu: 8h each = 24h
    // Fri: 9→15 = 6h
    // Total: 36h
    const start = new Date(2026, 0, 5, 11, 0, 0);
    const end = new Date(2026, 0, 9, 15, 0, 0);
    const d = Duration.businessDays(start, end);
    assert.equal(d.toMilliseconds(), 36 * HOUR);
  });

  it('respects workDays override (Sun-Thu)', () => {
    // Sun 2026-01-04 09:00 → Sun 2026-01-04 17:00 with workDays = [0,1,2,3,4]
    const start = new Date(2026, 0, 4, 9, 0, 0);
    const end = new Date(2026, 0, 4, 17, 0, 0);
    const d = Duration.businessDays(start, end, { workDays: [0, 1, 2, 3, 4] });
    assert.equal(d.toMilliseconds(), 8 * HOUR);
  });

  it('respects workStart and workEnd override', () => {
    // Mon 2026-01-05 07:00 → 19:00 with 8..18 window → 10h
    const start = new Date(2026, 0, 5, 7, 0, 0);
    const end = new Date(2026, 0, 5, 19, 0, 0);
    const d = Duration.businessDays(start, end, { workStart: 8, workEnd: 18 });
    assert.equal(d.toMilliseconds(), 10 * HOUR);
  });

  it('is symmetric in start/end order', () => {
    const a = new Date(2026, 0, 5, 9, 0, 0);
    const b = new Date(2026, 0, 9, 17, 0, 0);
    const forward = Duration.businessDays(a, b).toMilliseconds();
    const reverse = Duration.businessDays(b, a).toMilliseconds();
    assert.equal(forward, reverse);
  });

  it('accepts numeric and string Date inputs', () => {
    const start = new Date(2026, 0, 5, 9, 0, 0);
    const end = new Date(2026, 0, 5, 17, 0, 0);
    const fromNumbers = Duration.businessDays(start.getTime(), end.getTime());
    const fromStrings = Duration.businessDays(start.toISOString(), end.toISOString());
    assert.equal(fromNumbers.toMilliseconds(), 8 * HOUR);
    assert.equal(fromStrings.toMilliseconds(), 8 * HOUR);
  });

  it('throws on invalid workDays', () => {
    assert.throws(
      () => Duration.businessDays(new Date(), new Date(), { workDays: [7] }),
      /workDays/,
    );
  });

  it('throws when workStart >= workEnd', () => {
    assert.throws(
      () => Duration.businessDays(new Date(), new Date(), { workStart: 17, workEnd: 9 }),
      /workStart/,
    );
  });
});

describe('toBusinessHours / toBusinessDays', () => {
  it('toBusinessHours converts ms to hours', () => {
    const d = duration('5h');
    assert.equal(d.toBusinessHours(), 5);
  });

  it('toBusinessDays uses default 8-hour business day', () => {
    const d = duration('16h');
    assert.equal(d.toBusinessDays(), 2);
  });

  it('toBusinessDays respects workStart/workEnd override', () => {
    // 10-hour day → 20h = 2 days
    const d = duration('20h');
    assert.equal(d.toBusinessDays({ workStart: 8, workEnd: 18 }), 2);
  });

  it('Duration.businessDays then toBusinessDays round-trips', () => {
    // Mon→Fri full week of 8h days = 5 business days
    const start = new Date(2026, 0, 5, 9, 0, 0);
    const end = new Date(2026, 0, 9, 17, 0, 0);
    const bd = Duration.businessDays(start, end);
    assert.equal(bd.toBusinessDays(), 5);
  });
});
