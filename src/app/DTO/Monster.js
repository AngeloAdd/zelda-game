module.exports = class Monster {
	constructor(name, roomNumber, alive, weakness, guardedPath) {
		this.name = name
		this.roomNumber = roomNumber
		this.alive = alive
		this.weakness = weakness
		this.guardedPath = guardedPath
	}
}
