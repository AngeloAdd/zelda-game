const locate = require('../utils/locate')

module.exports = class ObjectsCollection {
	constructor(objects) {
		this.objects = objects
	}

	getByRoomCoordinates(roomCoordinates) {
		return this.objects.filter(locate(roomCoordinates))
	}

	getWhereRoomCoordinatesAreNull() {
		return this.objects.filter(locate(null))
	}

	dissociateFromRoomByObjectName(objectName, currentRoomCoordinates) {
		this.objects.forEach((el) => {
			if (
				el.name === objectName &&
				el.roomCoordinates?.equals(currentRoomCoordinates?.row, currentRoomCoordinates?.column)
			) {
				el.roomCoordinates = null
			}
		})
	}

	associateToRoomByObjectName(objectName, roomCoordinates) {
		this.objects.forEach((el) => {
			if (el.name === objectName && el.roomCoordinates === null) {
				el.roomCoordinates = roomCoordinates
			}
		})
	}

	add(object) {
		this.objects.push(object)

		return this
	}
}
