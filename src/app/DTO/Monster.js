module.exports = class Monster {
	constructor(name, room, alive, weakness, guardedPath) {
		this.name = name
		this.room = room
		this.alive = alive
		this.weakness = weakness
		this.guardedPath = guardedPath
	}
}
