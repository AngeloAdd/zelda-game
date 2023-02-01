module.exports = class Locatable {
	constructor(roomCoordinates) {
		this.roomCoordinates = roomCoordinates
	}

	getRoomCoordinates() {
		return this.roomCoordinates
	}
}
