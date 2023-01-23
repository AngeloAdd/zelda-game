const Object = require('./DTO/Object.js')
const Monster = require('./DTO/Monster.js')
const Room = require('./DTO/Room.js')

const ONE_MILION = 1000000
const HALF_MILION = ONE_MILION / 2

module.exports = class GameState {
	constructor(roomsList) {
		//this will be demanded to a builder -> random config or reading from config file for objects monster and rooms
		this.objects = this._loadObjectsState()
		this.monsters = this._loadMonstersState()
		this.roomsList = roomsList
		this.currentRoom = new Room(1, this.roomsList['1'].exits)
		this.isGameRunning = true
		this.endingReason = null
	}

	getObjectsByRoom() {
		return this.objects.filter((el) => el.room === this.currentRoom.roomNumber)
	}

	getMonsterByRoom() {
		return this.monsters.filter((el) => el.room === this.currentRoom.roomNumber)[0] ?? null
	}

	getRoomInfo() {
		return this.currentRoom
	}

	getPlayerBagStatus() {
		return this.objects.filter((el) => el.room === null)
	}

	setRoomByNumber(roomNumber) {
		this.currentRoom = new Room(roomNumber, this.roomsList[`${roomNumber}`].exits)
	}

	setGameEnding(reason) {
		this.isGameRunning = false
		this.endingReason = reason
	}

	_loadObjectsState() {
		return [
			new Object('GOLDEN EGG', 2, HALF_MILION),
			new Object('MIRROR SHIELD', 3, 0),
			new Object('GOLDEN CALICE', 4, HALF_MILION),
			new Object('SILVER SWORD', 7, 0),
			new Object('DUSTY PROOF', 8, ONE_MILION)
		]
	}

	_loadMonstersState() {
		return [
			new Monster('Medusa', 5, true, 'MIRROR SHIELD'),
			new Monster('Dracula', 6, true, 'SILVER SWORD')
		]
	}
}
