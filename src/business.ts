export interface BusinessHoursOptions {
  /** Days of week considered as work days. 0 = Sunday, 6 = Saturday. Defaults to Mon-Fri ([1, 2, 3, 4, 5]). */
  workDays?: number[];
  /** Hour at which the work day starts (0-23). Defaults to 9. */
  workStart?: number;
  /** Hour at which the work day ends (0-23, exclusive). Defaults to 17. */
  workEnd?: number;
}

interface ResolvedOptions {
  workDays: number[];
  workStart: number;
  workEnd: number;
}

const DEFAULTS: ResolvedOptions = {
  workDays: [1, 2, 3, 4, 5],
  workStart: 9,
  workEnd: 17,
};

function resolveOptions(opts?: BusinessHoursOptions): ResolvedOptions {
  const workDays = opts?.workDays ?? DEFAULTS.workDays;
  const workStart = opts?.workStart ?? DEFAULTS.workStart;
  const workEnd = opts?.workEnd ?? DEFAULTS.workEnd;

  if (!Array.isArray(workDays) || workDays.length === 0) {
    throw new Error('workDays must be a non-empty array');
  }
  for (const d of workDays) {
    if (!Number.isInteger(d) || d < 0 || d > 6) {
      throw new Error(`workDays must contain integers in 0..6, got ${d}`);
    }
  }
  if (!Number.isFinite(workStart) || workStart < 0 || workStart > 23) {
    throw new Error(`workStart must be in 0..23, got ${workStart}`);
  }
  if (!Number.isFinite(workEnd) || workEnd < 0 || workEnd > 24) {
    throw new Error(`workEnd must be in 0..24, got ${workEnd}`);
  }
  if (workStart >= workEnd) {
    throw new Error(`workStart (${workStart}) must be less than workEnd (${workEnd})`);
  }

  return { workDays, workStart, workEnd };
}

/**
 * Compute the elapsed business time in milliseconds between two Date inputs.
 *
 * Walks day-by-day, capping each day's elapsed range to the work window for
 * configured work days. Order of `start`/`end` does not matter — the result
 * is non-negative.
 */
export function businessMs(
  start: Date | number | string,
  end: Date | number | string,
  opts?: BusinessHoursOptions,
): number {
  const t1 = new Date(start).getTime();
  const t2 = new Date(end).getTime();
  if (!Number.isFinite(t1) || !Number.isFinite(t2)) {
    throw new Error('Invalid date input');
  }

  const { workDays, workStart, workEnd } = resolveOptions(opts);
  const lo = Math.min(t1, t2);
  const hi = Math.max(t1, t2);

  if (lo === hi) return 0;

  // Iterate by calendar day in local time.
  const cursor = new Date(lo);
  cursor.setHours(0, 0, 0, 0);

  let total = 0;

  while (cursor.getTime() <= hi) {
    const dayStart = cursor.getTime();
    const dow = cursor.getDay();

    if (workDays.includes(dow)) {
      const windowStart = new Date(cursor);
      windowStart.setHours(workStart, 0, 0, 0);

      const windowEnd = new Date(cursor);
      windowEnd.setHours(0, 0, 0, 0);
      windowEnd.setTime(windowEnd.getTime() + workEnd * 3_600_000);

      const segStart = Math.max(lo, windowStart.getTime());
      const segEnd = Math.min(hi, windowEnd.getTime());

      if (segEnd > segStart) {
        total += segEnd - segStart;
      }
    }

    // Advance to next calendar day (handles DST safely via setDate).
    cursor.setTime(dayStart);
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }

  return total;
}

/** Milliseconds in one business day for the given options. */
export function businessDayMs(opts?: BusinessHoursOptions): number {
  const { workStart, workEnd } = resolveOptions(opts);
  return (workEnd - workStart) * 3_600_000;
}
