const locate = require('../utils/locate')

module.exports = class ObjectsCollection {
	constructor(objects) {
		this.objects = objects
	}

	getByRoom(roomNumber) {
		return this.objects.filter(locate(roomNumber))
	}

	getWhereRoomIsNull() {
		return this.objects.filter(locate(null))
	}

	dissociateFromRoomByObjectName(objectName) {
		this._setRoomOnObject(objectName, null)
	}

	associateToRoomByObjectName(objectName, roomNumber) {
		this._setRoomOnObject(objectName, roomNumber)
	}

	_setRoomOnObject(objectName, roomNumberOrNull) {
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.roomNumber = roomNumberOrNull
			}
		})
	}
}
