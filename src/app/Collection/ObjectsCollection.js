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

	dissociateFromRoomByObjectName(objectName) {
		this._setRoomOnObject(objectName, null)
	}

	associateToRoomByObjectName(objectName, roomCoordinates) {
		this._setRoomOnObject(objectName, roomCoordinates)
	}

	_setRoomOnObject(objectName, roomCoordinatesOrNull) {
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.roomCoordinates = roomCoordinatesOrNull
			}
		})
	}
}
