# @philiprehberger/duration-ts

[![CI](https://github.com/philiprehberger/duration-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/duration-ts/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/duration-ts.svg)](https://www.npmjs.com/package/@philiprehberger/duration-ts)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/duration-ts)](https://github.com/philiprehberger/duration-ts/commits/main)

Parse, format, and manipulate time durations

## Installation

```bash
npm install @philiprehberger/duration-ts
```

## Usage

```ts
import { duration, Duration } from '@philiprehberger/duration-ts';

const timeout = duration('5m 30s');
timeout.toMilliseconds(); // 330000
timeout.humanize();       // "5 minutes, 30 seconds"
timeout.toISO();          // "PT5M30S"

duration('1h').add('30m').short(); // "1h 30m"
Duration.between(start, end).toSeconds(); // 42.5
```

### Parsing

```ts
duration('2h 30m');     // human format
duration('PT2H30M');    // ISO 8601
duration(9000000);      // milliseconds
```

### Arithmetic

```ts
duration('1h')
  .add('30m')
  .subtract('15m')
  .multiply(2)
  .humanize(); // "2 hours, 30 minutes"
```

### Relative Time

```ts
duration('2d').toRelative();      // "2 days ago"
duration('-3h').toRelative();     // "in 3 hours"
duration('500ms').toRelative();   // "just now"
```

### Clamping

```ts
duration('5m').clamp('1m', '3m').humanize();  // "3 minutes"
duration('30s').clamp('1m', '1h').humanize(); // "1 minute"
```

### Quantization

```ts
duration('1m 30s').roundTo('m').humanize(); // "2 minutes"
duration('7h').roundTo('d').humanize();     // "0 milliseconds"
duration('14h').roundTo('d').humanize();    // "1 day"
```

### Between Two Dates

```ts
const start = new Date('2026-01-01');
const end = new Date('2026-01-03');
Duration.between(start, end).humanize(); // "2 days"
Duration.between(start, end).toRelative(); // "2 days ago"
```

## API

| Method | Description |
|--------|-------------|
| `duration(input)` | Create from string or milliseconds |
| `Duration.between(a, b)` | Duration between two dates |
| `.humanize()` | `"2 hours, 30 minutes"` |
| `.short()` | `"2h 30m"` |
| `.toISO()` | `"PT2H30M"` |
| `.toRelative()` | `"2 days ago"`, `"in 3 hours"`, `"just now"` |
| `.toMilliseconds()` / `.toSeconds()` / `.toMinutes()` / `.toHours()` / `.toDays()` | Convert to number |
| `.add(other)` / `.subtract(other)` | Arithmetic |
| `.multiply(n)` / `.divide(n)` / `.abs()` | Arithmetic |
| `.clamp(min, max)` | Constrain duration within bounds |
| `.roundTo(unit)` | Round to nearest unit (`ms`, `s`, `m`, `h`, `d`, `w`) |
| `.equals(other)` / `.isLongerThan(other)` / `.isShorterThan(other)` / `.isZero()` | Comparison |

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/duration-ts)

🐛 [Report issues](https://github.com/philiprehberger/duration-ts/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/duration-ts/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
