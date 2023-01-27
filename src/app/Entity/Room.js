const Locatable = require('./Locatable')
const DIRECTIONS = ['south', 'north', 'east', 'west']

module.exports = class Room extends Locatable {
	constructor(roomCoordinates, roomExits, side) {
		super(roomCoordinates)
		this.roomExits = roomExits
		this.side = side
	}

	hasExit(exit) {
		return DIRECTIONS.includes(exit) && this.roomExits.includes(exit)
	}

	isFirst() {
		return this.roomCoordinates.equals(0, 0)
	}

	isLast() {
		return this.roomCoordinates.equals(this.side - 1, this.side - 1)
	}
}
