const RoomsCollection = require('./Collection/RoomsCollection')
const ObjectsCollection = require('./Collection/ObjectsCollection')
const MonsterCollection = require('./Collection/MonstersCollection')

module.exports = class GameState {
	constructor(config) {
		//this will be demanded to a builder -> random config or reading from config file for objects monster and rooms
		const roomsCollection = RoomsCollection.fromArray(config.rooms)
		roomsCollection.setFirstRoomAsCurrent()
		this.roomsCollection = roomsCollection

		this.monsters = MonsterCollection.fromArray(config.monsters)
		this.objects = ObjectsCollection.fromArray(config.objects)

		this.playerBagCapacity = config.playerBagCapacity
		this.roomCapacity = config.roomsCapacity
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
