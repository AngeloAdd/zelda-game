module.exports = class Locatable {
	constructor(roomNumber) {
		this.roomNumber = roomNumber
	}

	getRoomNumber() {
		return this.roomNumber
	}
}
