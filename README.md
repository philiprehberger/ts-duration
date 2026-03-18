# @philiprehberger/duration-ts

[![CI](https://github.com/philiprehberger/ts-duration/actions/workflows/publish.yml/badge.svg)](https://github.com/philiprehberger/ts-duration/actions/workflows/publish.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/duration-ts.svg)](https://www.npmjs.com/package/@philiprehberger/duration-ts)
[![License](https://img.shields.io/github/license/philiprehberger/ts-duration)](LICENSE)

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

## API

| Method | Description |
|--------|-------------|
| `duration(input)` | Create from string or milliseconds |
| `Duration.between(a, b)` | Duration between two dates |
| `.humanize()` | `"2 hours, 30 minutes"` |
| `.short()` | `"2h 30m"` |
| `.toISO()` | `"PT2H30M"` |
| `.toMilliseconds()` / `.toSeconds()` / `.toMinutes()` / `.toHours()` / `.toDays()` | Convert to number |
| `.add(other)` / `.subtract(other)` | Arithmetic |
| `.multiply(n)` / `.divide(n)` / `.abs()` | Arithmetic |
| `.equals(other)` / `.isLongerThan(other)` / `.isShorterThan(other)` / `.isZero()` | Comparison |


## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
