const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

const ISO_REGEX = /^P(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

export function parseHuman(input: string): number {
  let total = 0;
  let found = false;
  const regex = /(\d+(?:\.\d+)?)\s*(ms|s|m|h|d|w)/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    found = true;
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const multiplier = UNIT_MS[unit];
    if (multiplier !== undefined) {
      total += value * multiplier;
    }
  }

  if (!found) {
    throw new Error(`Invalid duration string: "${input}"`);
  }

  return total;
}

export function parseISO(input: string): number {
  const match = input.match(ISO_REGEX);
  if (!match) {
    throw new Error(`Invalid ISO 8601 duration: "${input}"`);
  }

  const days = parseFloat(match[1] || '0');
  const hours = parseFloat(match[2] || '0');
  const minutes = parseFloat(match[3] || '0');
  const seconds = parseFloat(match[4] || '0');

  return days * 86_400_000 + hours * 3_600_000 + minutes * 60_000 + seconds * 1_000;
}

export function parseDuration(input: string | number): number {
  if (typeof input === 'number') {
    if (!Number.isFinite(input)) {
      throw new Error(`Invalid millisecond value: ${input}`);
    }
    return input;
  }
  if (input.startsWith('P')) return parseISO(input);
  return parseHuman(input);
}
