import * as migration_20251209_205035 from './20251209_205035';

export const migrations = [
	{
		up: migration_20251209_205035.up,
		down: migration_20251209_205035.down,
		name: '20251209_205035',
	},
];
