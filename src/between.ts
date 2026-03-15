export function between(date1: Date | number | string, date2: Date | number | string): number {
  const t1 = new Date(date1).getTime();
  const t2 = new Date(date2).getTime();
  if (!Number.isFinite(t1) || !Number.isFinite(t2)) {
    throw new Error('Invalid date input');
  }
  return Math.abs(t2 - t1);
}
