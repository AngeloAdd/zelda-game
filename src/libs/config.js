const ONE_MILION = 1000000
const HALF_MILION = ONE_MILION / 2
const SILVER_DAGGER = 'SILVER DAGGER'
const MIRROR_SHIELD = 'MIRROR SHIELD'
const EXITS = {
	west: 'West',
	east: 'East',
	south: 'South',
	north: 'North'
}

module.exports = {
	rooms: [
		{ exits: [EXITS.west, EXITS.east, EXITS.south] },
		{ exits: [EXITS.east, EXITS.south, EXITS.west] },
		{ exits: [EXITS.west] },
		{ exits: [EXITS.north] },
		{ exits: [EXITS.north, EXITS.east, EXITS.south] },
		{ exits: [EXITS.south, EXITS.west] },
		{ exits: [EXITS.east] },
		{ exits: [EXITS.north, EXITS.west] },
		{ exits: [EXITS.north] }
	],
	objects: [
		{ name: 'GOLDEN EGG', room: 2, value: HALF_MILION },
		{ name: 'GOLDEN CALICE', room: 4, value: HALF_MILION },
		{ name: 'DUSTY PROOF', room: 8, value: ONE_MILION },
		{ name: MIRROR_SHIELD, room: 3, value: 0 },
		{ name: SILVER_DAGGER, room: 7, value: 0 }
	],
	monsters: [
		{ name: 'Medusa', room: 5, weakness: MIRROR_SHIELD, guardedPath: 'south' },
		{ name: 'Dracula', room: 6, weakness: SILVER_DAGGER, guardedPath: 'south' }
	],
	playerBagCapacity: 3,
	roomsCapacity: 4
}
