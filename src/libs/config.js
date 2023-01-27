const ONE_MILION = 1000000
const HALF_MILION = ONE_MILION / 2
const SILVER_DAGGER = 'SILVER DAGGER'
const MIRROR_SHIELD = 'MIRROR SHIELD'
const EXITS = {
	west: 'west',
	east: 'east',
	south: 'south',
	north: 'north'
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
		{ name: 'GOLDEN EGG', roomNumber: 2, value: HALF_MILION },
		{ name: 'GOLDEN CALICE', roomNumber: 4, value: HALF_MILION },
		{ name: 'DUSTY PROOF', roomNumber: 8, value: ONE_MILION },
		{ name: MIRROR_SHIELD, roomNumber: 3, value: 0 },
		{ name: SILVER_DAGGER, roomNumber: 7, value: 0 }
	],
	monsters: [
		{ name: 'medusa', roomNumber: 5, weakness: MIRROR_SHIELD, guardedPath: 'south' },
		{ name: 'dracula', roomNumber: 6, weakness: SILVER_DAGGER, guardedPath: 'south' }
	],
	playerBagCapacity: 3,
	roomsCapacity: 4
}
