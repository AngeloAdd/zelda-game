const Locatable = require('./Locatable')

module.exports = class Monster extends Locatable {
	constructor(name, roomNumber, alive, weakness, guardedPath) {
		super(roomNumber)
		this.name = name
		this.alive = alive
		this.weakness = weakness
		this.guardedPath = guardedPath
	}
}
