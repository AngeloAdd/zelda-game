const DIRECTIONS = ['south', 'north', 'east', 'west']

module.exports = class Room {
	constructor(isCurrent, roomNumber, roomExits, isFirst, isLast) {
		this.isCurrent = isCurrent
		this.roomNumber = roomNumber
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
