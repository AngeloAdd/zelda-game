const DIRECTIONS = ['south', 'north', 'east', 'west']
module.exports = class Room {
	constructor(roomNumber, roomDescription) {
		this.roomNumber = roomNumber
		this.roomDescription = roomDescription
		this.roomExits = this.parseRoomExit()
	}

	parseRoomExit() {
		return DIRECTIONS.filter((el) => this.roomDescription[1].toLowerCase().includes(el))
	}
}
