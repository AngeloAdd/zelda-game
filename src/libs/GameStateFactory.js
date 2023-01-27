const GameState = require('../app/GameState')
const RoomsCollection = require('../app/Collection/RoomsCollection')
const MonsterCollection = require('../app/Collection/MonstersCollection')
const ObjectsCollection = require('../app/Collection/ObjectsCollection')
const Room = require('../app/Entity/Room')
const Object = require('../app/Entity/Object')
const Monster = require('../app/Entity/Monster')
const MonstersCollection = require('../app/Collection/MonstersCollection')

module.exports = class GameStateFactory {
	static create(config) {
		return new GameState(
			this._makeRoomsCollection(config.rooms, 1),
			this._makeObjectsCollection(config.objects),
			this._makeMonstersCollection(config.monsters),
			config.playerBagCapacity,
			config.roomsCapacity
		)
	}

	static _makeRoomsCollection(roomsFromConfig, startingRoom) {
		return new RoomsCollection(
			roomsFromConfig.map(
				(el, i) => new Room(i + 1, el.exits, i === 0, i === roomsFromConfig.length - 1)
			),
			startingRoom
		)
	}

	static _makeObjectsCollection(objectsFromConfig) {
		return new ObjectsCollection(
			objectsFromConfig.map((el) => new Object(el.name, el.roomNumber, el.value))
		)
	}

	static _makeMonstersCollection(monstersFromConfig) {
		return new MonstersCollection(
			monstersFromConfig.map(
				(el) => new Monster(el.name, el.roomNumber, true, el.weakness, el.guardedPath)
			)
		)
	}
}
