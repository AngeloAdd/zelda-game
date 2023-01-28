const ONE_MILION = 1000000
const HALF_MILION = ONE_MILION / 2
const SILVER_DAGGER = 'SILVER DAGGER'
const MIRROR_SHIELD = 'MIRROR SHIELD'
const MAGIC_LANCE = 'MAGIC LANCE'
const EXITS = {
	west: 'west',
	east: 'east',
	south: 'south',
	north: 'north'
}

const easy = {
	mazeSide: 3,
	rooms: [
		[EXITS.west, EXITS.east, EXITS.south],
		[EXITS.east, EXITS.south, EXITS.west],
		[EXITS.west],
		[EXITS.north],
		[EXITS.north, EXITS.east, EXITS.south],
		[EXITS.south, EXITS.west],
		[EXITS.east],
		[EXITS.north, EXITS.west],
		[EXITS.north]
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

const normal = {
	mazeSide: 5,
	rooms: [
		[EXITS.east, EXITS.west],
		[EXITS.south, EXITS.west],
		[EXITS.south],
		[EXITS.east, EXITS.south],
		[EXITS.south, EXITS.west],
		[EXITS.east, EXITS.south],
		[EXITS.north, EXITS.west],
		[EXITS.north, EXITS.east],
		[EXITS.north, EXITS.west],
		[EXITS.north, EXITS.south],
		[EXITS.north, EXITS.south],
		[EXITS.east, EXITS.south],
		[EXITS.east, EXITS.south, EXITS.west],
		[EXITS.east, EXITS.west],
		[EXITS.north, EXITS.south, EXITS.west],
		[EXITS.north, EXITS.east],
		[EXITS.north, EXITS.west],
		[EXITS.north, EXITS.south],
		[EXITS.east],
		[EXITS.north, EXITS.south, EXITS.west],
		[EXITS.east],
		[EXITS.east, EXITS.west],
		[EXITS.north, EXITS.east, EXITS.west],
		[EXITS.west],
		[EXITS.north]
	],
	objects: [
		{ name: 'GOLDEN EGG', roomCoordinates: [0, 1], value: HALF_MILION },
		{ name: 'GOLDEN CALICE', roomCoordinates: [1, 0], value: HALF_MILION },
		{ name: 'DUSTY PROOF', roomCoordinates: [2, 1], value: ONE_MILION },
		{ name: 'DUSTY PROOF', roomCoordinates: [2, 1], value: ONE_MILION },
		{ name: 'DUSTY PROOF', roomCoordinates: [2, 1], value: ONE_MILION },
		{ name: 'DUSTY PROOF', roomCoordinates: [2, 1], value: ONE_MILION },
		{ name: MIRROR_SHIELD, roomCoordinates: [3, 3], value: 0 },
		{ name: SILVER_DAGGER, roomCoordinates: [0, 2], value: 0 },
		{ name: MAGIC_LANCE, roomCoordinates: [4, 0], value: 0 }
	],
	monsters: [
		{ name: 'medusa', roomCoordinates: [1, 4], weakness: MIRROR_SHIELD, guardedPath: 'north' },
		{ name: 'dracula', roomCoordinates: [3, 2], weakness: SILVER_DAGGER, guardedPath: 'south' },
		{ name: 'fenrir', roomCoordinates: [3, 4], weakness: MAGIC_LANCE, guardedPath: 'south' }
	],
	playerBagCapacity: 3,
	roomsCapacity: 5
}

module.exports = {
	easy,
	normal
}
