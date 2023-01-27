const RoomsCollection = require('./Collection/RoomsCollection')
const ObjectsCollection = require('./Collection/ObjectsCollection')
const MonsterCollection = require('./Collection/MonstersCollection')

module.exports = class GameState {
	constructor(
		roomsCollection,
		objectsCollection,
		monstersCollection,
		playerBagCapacity,
		roomsCapacity
	) {
		//this will be demanded to a factory -> random config or reading from config file for objects monster and rooms
		this.roomsCollection = roomsCollection
		this.objects = objectsCollection
		this.monsters = monstersCollection
		this.playerBagCapacity = playerBagCapacity
		this.roomCapacity = roomsCapacity
		this.isRunning = true
		this.endingReason = null
	}

	getCurrentRoom() {
		return this.roomsCollection.getCurrent()
	}

	getMonsterInCurrentRoom() {
		return this.monsters.findByRoom(this.getCurrentRoom().roomNumber)
	}

	getObjectsInCurrentRoom() {
		return this.objects.getByRoom(this.getCurrentRoom().roomNumber)
	}

	getObjectsInPlayerBag() {
		return this.objects.getWhereRoomIsNull()
	}

	isPlayerBagFull() {
		return this.getObjectsInPlayerBag().length === this.playerBagCapacity
	}

	isRoomFull() {
		return this.getObjectsInCurrentRoom().length === this.roomCapacity
	}

	setCurrentRoomByNumber(roomNumber) {
		this.roomsCollection.setCurrentRoomByNumber(roomNumber)
	}

	pickObject(objectName) {
		this.objects.dissociateFromRoomByObjectName(objectName)
	}

	dropObject(objectName) {
		this.objects.associateToRoomByObjectName(objectName, this.getCurrentRoom().roomNumber)
	}

	killMonster(monsterName) {
		this.monsters.setDeadByMonsterName(monsterName)
	}

	setGameEnding(reason) {
		this.isRunning = false
		this.endingReason = reason
	}
}
