const Room = require('../DTO/Room')
const locate = require('../utils/locate')

module.exports = class RoomsCollection {
	constructor(rooms) {
		this.rooms = rooms
		this.currentRoomNumber = 1
	}

	static fromArray(items) {
		return new RoomsCollection(
			items.map((el, i) => {
				return new Room(i + 1, el.exits, i === 0, i === items.length - 1)
			})
		)
	}

	getCurrent() {
		return this.rooms.find(locate(this.currentRoomNumber))
	}

	setFirstRoomAsCurrent() {
		this.setCurrentRoomByNumber(1)
	}

	setCurrentRoomByNumber(roomNumber) {
		this.currentRoomNumber = roomNumber
	}
}
