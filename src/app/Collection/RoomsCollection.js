const Room = require('../DTO/Room')
module.exports = class RoomsCollection {
	constructor(rooms) {
		this.rooms = rooms
	}

	static fromArray(items) {
		return new RoomsCollection(
			items.map((el, i) => {
				return new Room(false, i + 1, el.exits, i === 0, i === items.length - 1)
			})
		)
	}

	getCurrent() {
		return this.rooms.filter((el) => el.isCurrent)[0]
	}

	setFirstRoomAsCurrent() {
		this.setCurrentRoomByNumber(1)
	}

	setCurrentRoomByNumber(roomNumber) {
		this.rooms.forEach((el) => {
			if (el.roomNumber !== roomNumber && el.isCurrent) {
				el.isCurrent = false
			}

			if (el.roomNumber === roomNumber) {
				el.isCurrent = true
			}

			return el
		})
	}
}
