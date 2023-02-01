module.exports = class GameState {
	constructor(roomsCollection, objectsCollection, monstersCollection, playerBagCapacity, roomsCapacity) {
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
		return this.monsters.findByRoomCoordinates(this.getCurrentRoom().roomCoordinates)
	}

	getObjectsInCurrentRoom() {
		return this.objects.getByRoomCoordinates(this.getCurrentRoom().roomCoordinates)
	}

	getObjectsInPlayerBag() {
		return this.objects.getWhereRoomCoordinatesAreNull()
	}

	isPlayerBagFull(numberOfObjectsInTheRoom) {
		return this.getObjectsInPlayerBag().length + numberOfObjectsInTheRoom > this.playerBagCapacity
	}

	isRoomFull(numberOfObjectsToDrop) {
		return this.getObjectsInCurrentRoom().length + numberOfObjectsToDrop > this.roomCapacity
	}

	setCurrentRoomByNumber(roomCoordinates) {
		this.roomsCollection.setCurrentRoomByNumber(roomCoordinates)
	}

	pickObject(objectName) {
		this.objects.dissociateFromRoomByObjectName(objectName, this.getCurrentRoom().roomCoordinates)
	}

	dropObject(objectName) {
		this.objects.associateToRoomByObjectName(objectName, this.getCurrentRoom().roomCoordinates)
	}

	killMonster(monsterName) {
		this.monsters.setDeadByMonsterName(monsterName)
	}

	setGameEnding(reason) {
		this.isRunning = false
		this.endingReason = reason
	}
}
