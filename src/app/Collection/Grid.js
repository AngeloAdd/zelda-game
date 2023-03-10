const locate = require('../utils/locate')

module.exports = class Grid {
	constructor(rooms, currentRoom) {
		this.rooms = rooms
		this.currentroomCoordinates = currentRoom
	}

	getCurrent() {
		return this.rooms.find(locate(this.currentroomCoordinates))
	}

	setCurrentRoomByNumber(roomCoordinates) {
		this.currentroomCoordinates = roomCoordinates
	}
}
