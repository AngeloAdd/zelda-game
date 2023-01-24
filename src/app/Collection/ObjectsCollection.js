const Object = require('../DTO/Object')
module.exports = class ObjectsCollection {
	constructor(objects) {
		this.objects = objects
	}

	static fromArray(items) {
		return new ObjectsCollection(items.map((el) => new Object(el.name, el.room, el.value)))
	}

	getByRoom(roomNumber) {
		return this.objects.filter((el) => el.room === roomNumber)
	}

	getWhereRoomIsNull() {
		return this.objects.filter((el) => el.room === null)
	}

	dissociateFromRoomByObjectName(objectName) {
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.room = null
			}
		})
	}

	associateToRoomByObjectName(objectName, roomNumber) {
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.room = roomNumber
			}
		})
	}
}
