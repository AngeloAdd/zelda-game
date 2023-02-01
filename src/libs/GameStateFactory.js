const GameState = require('../app/GameState')
const Grid = require('../app/Collection/Grid')
const ObjectsCollection = require('../app/Collection/ObjectsCollection')
const Room = require('../app/Entity/Room')
const Object = require('../app/Entity/Object')
const Monster = require('../app/Entity/Monster')
const MonstersCollection = require('../app/Collection/MonstersCollection')
const Coordinates = require('../app/utils/Coordinates')
const Exits = require('../app/utils/Exits')

module.exports = class GameStateFactory {
	constructor(config, randomizer) {
		this.config = config
		this.randomizer = randomizer
	}

	createWithDifficulty(difficulty) {
		const config = this.config[difficulty.toString()] ?? this.config['easy']
		let grid = this._makeGrid(config.rooms, config.mazeSide)
		return new GameState(
			grid,
			this._makeObjectsCollection(config.objects, grid, config.mazeSide, config.roomsCapacity),
			this._makeMonstersCollection(config.monsters),
			config.playerBagCapacity,
			config.roomsCapacity
		)
	}

	_makeGrid(roomsFromConfig, mazeSide) {
		let row = 0
		return new Grid(
			roomsFromConfig.map((exits, i) => {
				if (i && i % mazeSide === 0) {
					row++
				}
				return new Room(new Coordinates(row, i - row * mazeSide), new Exits(exits), mazeSide)
			}),
			new Coordinates(0, 0)
		)
	}

	_makeObjectsCollection(objectsFromConfig, grid, side, roomsCapacity) {
		const collection = new ObjectsCollection([])
		const rooms = {}
		for (let i = 0; i < objectsFromConfig.length; i++) {
			const object = objectsFromConfig[i]
			if (Array.isArray(object.roomCoordinates)) {
				let roomCoordinates = new Coordinates(...object.roomCoordinates)
				rooms[`${roomCoordinates.row}.${roomCoordinates.column}`] =
					(rooms[`${roomCoordinates.row}.${roomCoordinates.column}`] ?? 0) + 1
				collection.add(new Object(object.name, roomCoordinates, object.value))
			} else {
				let randomObjectsNumber = object.quantity
				while (randomObjectsNumber > 0) {
					let roomCoordinates = new Coordinates(
						this.randomizer.betweenMinAndMax(0, side - 1),
						this.randomizer.betweenMinAndMax(0, side - 1)
					)
					if (!(rooms[`${roomCoordinates.row}.${roomCoordinates.column}`] === roomsCapacity)) {
						rooms[`${roomCoordinates.row}.${roomCoordinates.column}`] =
							(rooms[`${roomCoordinates.row}.${roomCoordinates.column}`] ?? 0) + 1
						collection.add(new Object(object.name, roomCoordinates, object.value))
						--randomObjectsNumber
					}
				}
			}
		}

		return collection
	}

	_makeMonstersCollection(monstersFromConfig) {
		return new MonstersCollection(
			monstersFromConfig.map(
				(el) => new Monster(el.name, new Coordinates(...el.roomCoordinates), true, el.weakness, el.guardedPath)
			)
		)
	}
}
