const locate = require('../utils/locate')

module.exports = class RoomsCollection {
	constructor(rooms, currentRoom) {
		this.rooms = rooms
		this.currentRoomNumber = currentRoom
	}

	getCurrent() {
		return this.rooms.find(locate(this.currentRoomNumber))
	}

	setCurrentRoomByNumber(roomNumber) {
		this.currentRoomNumber = roomNumber
	}
}
