module.exports = class Locatable {
	constructor(roomCoordinates) {
		this.roomCoordinates = roomCoordinates
	}

	getroomCoordinates() {
		return this.roomCoordinates
	}
}
