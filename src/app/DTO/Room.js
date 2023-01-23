const DIRECTIONS = ['south', 'north', 'east', 'west']

module.exports = class Room {
	constructor(roomNumber, roomTexts) {
		this.roomNumber = roomNumber
		this.roomDescription = roomTexts.description
		this.roomExitsText = roomTexts.exits
		this.roomExitsList = this._parseRoomExit()
	}

	_parseRoomExit() {
		return DIRECTIONS.filter((el) => this.roomExitsText.toLowerCase().includes(el))
	}
}
