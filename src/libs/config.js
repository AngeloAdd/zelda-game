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
	side: 3,
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
		{ name: 'GOLDEN EGG', roomCoordinates: [0, 1], value: HALF_MILION },
		{ name: 'GOLDEN CALICE', roomCoordinates: [1, 0], value: HALF_MILION },
		{ name: 'DUSTY PROOF', roomCoordinates: [2, 1], value: ONE_MILION },
		{ name: MIRROR_SHIELD, roomCoordinates: [0, 2], value: 0 },
		{ name: SILVER_DAGGER, roomCoordinates: [2, 0], value: 0 }
	],
	monsters: [
		{ name: 'medusa', roomCoordinates: [1, 1], weakness: MIRROR_SHIELD, guardedPath: 'south' },
		{ name: 'dracula', roomCoordinates: [1, 2], weakness: SILVER_DAGGER, guardedPath: 'south' }
	],
	playerBagCapacity: 3,
	roomsCapacity: 4
}
