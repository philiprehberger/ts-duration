import { parseDuration } from './parse';
import { humanize, short, toISO, toRelative } from './format';
import { between } from './between';
import type { DurationUnit } from './types';

const UNIT_MS: Record<DurationUnit, number> = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

export class Duration {
  readonly ms: number;

  constructor(ms: number) {
    this.ms = ms;
  }

  static between(date1: Date | number | string, date2: Date | number | string): Duration {
    return new Duration(between(date1, date2));
  }

  humanize(): string { return humanize(this.ms); }
  short(): string { return short(this.ms); }
  toISO(): string { return toISO(this.ms); }
  toRelative(): string { return toRelative(this.ms); }
  toMilliseconds(): number { return this.ms; }
  toSeconds(): number { return this.ms / 1_000; }
  toMinutes(): number { return this.ms / 60_000; }
  toHours(): number { return this.ms / 3_600_000; }
  toDays(): number { return this.ms / 86_400_000; }

  clamp(min: string | number | Duration, max: string | number | Duration): Duration {
    const minMs = min instanceof Duration ? min.ms : parseDuration(min);
    const maxMs = max instanceof Duration ? max.ms : parseDuration(max);
    if (minMs > maxMs) throw new Error('min must not be greater than max');
    return new Duration(Math.min(Math.max(this.ms, minMs), maxMs));
  }

  roundTo(unit: DurationUnit): Duration {
    const unitMs = UNIT_MS[unit];
    return new Duration(Math.round(this.ms / unitMs) * unitMs);
  }

  add(other: string | number | Duration): Duration {
    const otherMs = other instanceof Duration ? other.ms : parseDuration(other);
    return new Duration(this.ms + otherMs);
  }

  subtract(other: string | number | Duration): Duration {
    const otherMs = other instanceof Duration ? other.ms : parseDuration(other);
    return new Duration(this.ms - otherMs);
  }

  multiply(n: number): Duration { return new Duration(this.ms * n); }

  divide(n: number): Duration {
    if (n === 0) throw new Error('Cannot divide by zero');
    return new Duration(this.ms / n);
  }

  abs(): Duration { return new Duration(Math.abs(this.ms)); }

  equals(other: string | number | Duration): boolean {
    const otherMs = other instanceof Duration ? other.ms : parseDuration(other);
    return this.ms === otherMs;
  }

  isLongerThan(other: string | number | Duration): boolean {
    const otherMs = other instanceof Duration ? other.ms : parseDuration(other);
    return Math.abs(this.ms) > Math.abs(otherMs);
  }

  isShorterThan(other: string | number | Duration): boolean {
    const otherMs = other instanceof Duration ? other.ms : parseDuration(other);
    return Math.abs(this.ms) < Math.abs(otherMs);
  }

  isZero(): boolean { return this.ms === 0; }
}

export function duration(input: string | number): Duration {
  return new Duration(parseDuration(input));
}
