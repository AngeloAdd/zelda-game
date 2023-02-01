const GameStateFactory = require('../src/libs/GameStateFactory')
const Coordinates = require('../src/app/utils/Coordinates')
const ObjectsCollection = require('../src/app/Collection/ObjectsCollection')
const Object = require('../src/app/Entity/Object')

module.exports = class GameStateFactoryFake extends GameStateFactory {
	constructor(config, randomizer, fakeCoordinates = []) {
		super(config, randomizer)
		this.fakeCoordinates = fakeCoordinates
	}

	createWithDifficulty(difficulty) {
		return super.createWithDifficulty(difficulty)
	}

	_makeMonstersCollection(monstersFromConfig) {
		return super._makeMonstersCollection(monstersFromConfig)
	}

	_makeGrid(roomsFromConfig, mazeSide) {
		return super._makeGrid(roomsFromConfig, mazeSide)
	}

	_makeObjectsCollection(objectsFromConfig, grid, side, roomsCapacity) {
		const collection = new ObjectsCollection([])
		let i = 0
		objectsFromConfig.forEach((el) => {
			let coord
			if (el.name === 'GOLDEN NUGGET') {
				let fakeCoordinate = this.fakeCoordinates[i] ?? [2, 2]
				coord = new Coordinates(...fakeCoordinate)
				++i
			} else {
				coord = new Coordinates(...el.roomCoordinates)
			}
			collection.add(new Object(el.name, coord, el.value))
		})

		return collection
	}
}
