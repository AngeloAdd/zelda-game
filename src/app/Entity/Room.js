const Locatable = require('./Locatable')

module.exports = class Room extends Locatable {
	constructor(roomCoordinates, roomExits, side) {
		super(roomCoordinates)
		this.roomExits = roomExits
		this.side = side
	}

	hasExit(exit) {
		return Object.keys(this.roomExits).includes(exit) && this.roomExits[exit]
	}

	isFirst() {
		return this.roomCoordinates.equals(0, 0)
	}

	isLast() {
		return this.roomCoordinates.equals(this.side - 1, this.side - 1)
	}

	index() {
		return this.side * this.roomCoordinates.row + this.roomCoordinates.column
	}
}
