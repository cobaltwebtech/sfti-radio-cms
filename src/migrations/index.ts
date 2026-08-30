import * as migration_20251209_205035 from './20251209_205035';
import * as migration_20260206_182006 from './20260206_182006';
import * as migration_20260417_201139 from './20260417_201139';
import * as migration_20260602_144700 from './20260602_144700';
import * as migration_20260604_150827 from './20260604_150827';
import * as migration_20260830_145305 from './20260830_145305';

export const migrations = [
  {
    up: migration_20251209_205035.up,
    down: migration_20251209_205035.down,
    name: '20251209_205035',
  },
  {
    up: migration_20260206_182006.up,
    down: migration_20260206_182006.down,
    name: '20260206_182006',
  },
  {
    up: migration_20260417_201139.up,
    down: migration_20260417_201139.down,
    name: '20260417_201139',
  },
  {
    up: migration_20260602_144700.up,
    down: migration_20260602_144700.down,
    name: '20260602_144700',
  },
  {
    up: migration_20260604_150827.up,
    down: migration_20260604_150827.down,
    name: '20260604_150827',
  },
  {
    up: migration_20260830_145305.up,
    down: migration_20260830_145305.down,
    name: '20260830_145305'
  },
];
