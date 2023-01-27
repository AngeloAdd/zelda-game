const Locatable = require('./Locatable')
const DIRECTIONS = ['south', 'north', 'east', 'west']

module.exports = class Room extends Locatable {
	constructor(roomNumber, roomExits, isFirst, isLast) {
		super(roomNumber)
		this.roomExits = roomExits
		this.isFirstRoom = isFirst
		this.isLastRoom = isLast
	}

	hasExit(exit) {
		return DIRECTIONS.includes(exit) && this.roomExits.some((el) => el.toLowerCase() === exit)
	}

	isFirst() {
		return this.isFirstRoom
	}

	isLast() {
		return this.isLastRoom
	}
}
