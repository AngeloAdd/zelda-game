const GameState = require('../app/GameState')
const Grid = require('../app/Collection/Grid')
const ObjectsCollection = require('../app/Collection/ObjectsCollection')
const Room = require('../app/Entity/Room')
const Object = require('../app/Entity/Object')
const Monster = require('../app/Entity/Monster')
const MonstersCollection = require('../app/Collection/MonstersCollection')
const Coordinates = require('../app/utils/Coordinates')

module.exports = class GameStateFactory {
	static create(config) {
		return new GameState(
			this._makeRoomsCollection(config.rooms, config.side),
			this._makeObjectsCollection(config.objects),
			this._makeMonstersCollection(config.monsters),
			config.playerBagCapacity,
			config.roomsCapacity
		)
	}

	static _makeRoomsCollection(roomsFromConfig, side) {
		let row = 0
		return new Grid(
			roomsFromConfig.map((el, i) => {
				if (i && i % side === 0) {
					row++
				}
				return new Room(new Coordinates(row, i - row * side), el.exits, side)
			}),
			new Coordinates(0, 0)
		)
	}

	static _makeObjectsCollection(objectsFromConfig) {
		return new ObjectsCollection(
			objectsFromConfig.map((el) => new Object(el.name, new Coordinates(...el.roomCoordinates), el.value))
		)
	}

	static _makeMonstersCollection(monstersFromConfig) {
		return new MonstersCollection(
			monstersFromConfig.map(
				(el) => new Monster(el.name, new Coordinates(...el.roomCoordinates), true, el.weakness, el.guardedPath)
			)
		)
	}
}
