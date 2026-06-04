import * as migration_20251209_205035 from './20251209_205035';
import * as migration_20260206_182006 from './20260206_182006';
import * as migration_20260417_201139 from './20260417_201139';
import * as migration_20260602_144700 from './20260602_144700';

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
];
