const Object = require('../DTO/Object')
const locate = require('../utils/locate')

module.exports = class ObjectsCollection {
	constructor(objects) {
		this.objects = objects
	}

	static fromArray(items) {
		return new ObjectsCollection(items.map((el) => new Object(el.name, el.roomNumber, el.value)))
	}

	getByRoom(roomNumber) {
		return this.objects.filter(locate(roomNumber))
	}

	getWhereRoomIsNull() {
		return this.objects.filter((el) => el.roomNumber === null)
	}

	dissociateFromRoomByObjectName(objectName) {
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.roomNumber = null
			}
		})
	}

	associateToRoomByObjectName(objectName, roomNumber) {
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.roomNumber = roomNumber
			}
		})
	}
}
