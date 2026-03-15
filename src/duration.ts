import { parseDuration } from './parse';
import { humanize, short, toISO } from './format';
import { between } from './between';

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
  toMilliseconds(): number { return this.ms; }
  toSeconds(): number { return this.ms / 1_000; }
  toMinutes(): number { return this.ms / 60_000; }
  toHours(): number { return this.ms / 3_600_000; }
  toDays(): number { return this.ms / 86_400_000; }

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
