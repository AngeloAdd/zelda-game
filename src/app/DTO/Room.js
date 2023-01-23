const DIRECTIONS = ['south', 'north', 'east', 'west']

module.exports = class Room {
	constructor(roomNumber, roomExits) {
		this.roomNumber = roomNumber
		this.roomExits = roomExits
	}

	hasExit(exit) {
		return DIRECTIONS.filter((el) => this.roomExits.toLowerCase().includes(el)).includes(exit)
	}
}
