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
		this.isRunning = true
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
		this.isRunning = false
		this.endingReason = reason
	}

	pickObject(objectName){
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.room = null
			}
		})
	}

	dropObject(objectName){
		this.objects.forEach((el) => {
			if (el.name === objectName) {
				el.room = this.currentRoom.roomNumber
			}
		})
	}

	killMonster(monsterName){
		this.monsters.forEach((el) => {
			if (el.name === monsterName) {
				el.alive = false
			}
			return el
		})
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
