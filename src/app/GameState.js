const Object = require('./DTO/Object.js')
const Monster = require('./DTO/Monster.js')
const Room = require('./DTO/Room.js')

const ONE_MILION = 1000000
const HALF_MILION = ONE_MILION / 2

module.exports = class GameState {
	constructor(textLoader) {
		this.textLoader = textLoader
		this.objects = this.loadObjectsState()
		this.monsters = this.loadMonstersState()
		this.currentRoom = new Room(1, this.textLoader.roomsText[0])
		this.isGameRunning = true
		this.endCause = null
	}

	loadObjectsState() {
		return [
			new Object('GOLDEN EGG', 2, HALF_MILION),
			new Object('MIRROR SHIELD', 3, 0),
			new Object('GOLDEN CALICE', 4, HALF_MILION),
			new Object('SILVER SWORD', 7, 0),
			new Object('DUSTY PROOF', 8, ONE_MILION)
		]
	}

	loadMonstersState() {
		return [
			new Monster('Medusa', 5, true, 'MIRROR SHIELD'),
			new Monster('Dracula', 6, true, 'SILVER SWORD')
		]
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

	setRoom(room) {
		this.currentRoom = room
	}

	gameEndingFor(cause) {
		this.isGameRunning = false
		this.endCause = cause
	}
}
