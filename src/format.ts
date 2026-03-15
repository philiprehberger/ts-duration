interface TimeComponents {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

function decompose(ms: number): TimeComponents {
  const abs = Math.abs(ms);
  return {
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs % 86_400_000) / 3_600_000),
    minutes: Math.floor((abs % 3_600_000) / 60_000),
    seconds: Math.floor((abs % 60_000) / 1_000),
    milliseconds: abs % 1_000,
  };
}

export function humanize(ms: number): string {
  if (ms === 0) return '0 milliseconds';

  const neg = ms < 0;
  const { days, hours, minutes, seconds, milliseconds } = decompose(ms);
  const parts: string[] = [];

  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  if (milliseconds > 0 && parts.length === 0) parts.push(`${milliseconds} ${milliseconds === 1 ? 'millisecond' : 'milliseconds'}`);

  const str = parts.join(', ');
  return neg ? `-${str}` : str;
}

export function short(ms: number): string {
  if (ms === 0) return '0ms';

  const neg = ms < 0;
  const { days, hours, minutes, seconds, milliseconds } = decompose(ms);
  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  if (milliseconds > 0 && parts.length === 0) parts.push(`${milliseconds}ms`);

  const str = parts.join(' ');
  return neg ? `-${str}` : str;
}

export function toISO(ms: number): string {
  const abs = Math.abs(ms);
  const { days, hours, minutes, seconds, milliseconds } = decompose(abs);

  let result = 'P';
  if (days > 0) result += `${days}D`;

  const timeParts: string[] = [];
  if (hours > 0) timeParts.push(`${hours}H`);
  if (minutes > 0) timeParts.push(`${minutes}M`);
  if (seconds > 0 || milliseconds > 0) {
    const sec = milliseconds > 0 ? seconds + milliseconds / 1000 : seconds;
    timeParts.push(`${sec}S`);
  }

  if (timeParts.length > 0) {
    result += 'T' + timeParts.join('');
  }

  if (result === 'P') result = 'PT0S';

  return ms < 0 ? `-${result}` : result;
}
