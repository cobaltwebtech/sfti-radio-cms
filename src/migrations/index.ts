import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20251125_222330 from './20251125_222330';
import * as migration_20251126_161540 from './20251126_161540';
import * as migration_20251126_163817 from './20251126_163817';
import * as migration_20251126_170640 from './20251126_170640';
import * as migration_20251126_212210 from './20251126_212210';
import * as migration_20251126_215002 from './20251126_215002';
import * as migration_20251126_221440 from './20251126_221440';
import * as migration_20251127_001653 from './20251127_001653';
import * as migration_20251127_030458 from './20251127_030458';
import * as migration_20251128_222746 from './20251128_222746';
import * as migration_20251202_160423 from './20251202_160423';

export const migrations = [
	{
		up: migration_20250929_111647.up,
		down: migration_20250929_111647.down,
		name: '20250929_111647',
	},
	{
		up: migration_20251125_222330.up,
		down: migration_20251125_222330.down,
		name: '20251125_222330',
	},
	{
		up: migration_20251126_161540.up,
		down: migration_20251126_161540.down,
		name: '20251126_161540',
	},
	{
		up: migration_20251126_163817.up,
		down: migration_20251126_163817.down,
		name: '20251126_163817',
	},
	{
		up: migration_20251126_170640.up,
		down: migration_20251126_170640.down,
		name: '20251126_170640',
	},
	{
		up: migration_20251126_212210.up,
		down: migration_20251126_212210.down,
		name: '20251126_212210',
	},
	{
		up: migration_20251126_215002.up,
		down: migration_20251126_215002.down,
		name: '20251126_215002',
	},
	{
		up: migration_20251126_221440.up,
		down: migration_20251126_221440.down,
		name: '20251126_221440',
	},
	{
		up: migration_20251127_001653.up,
		down: migration_20251127_001653.down,
		name: '20251127_001653',
	},
	{
		up: migration_20251127_030458.up,
		down: migration_20251127_030458.down,
		name: '20251127_030458',
	},
	{
		up: migration_20251128_222746.up,
		down: migration_20251128_222746.down,
		name: '20251128_222746',
	},
	{
		up: migration_20251202_160423.up,
		down: migration_20251202_160423.down,
		name: '20251202_160423',
	},
];
