const Locatable = require('./Locatable')

module.exports = class Monster extends Locatable {
	constructor(name, roomCoordinates, alive, weakness, guardedPath) {
		super(roomCoordinates)
		this.name = name
		this.alive = alive
		this.weakness = weakness
		this.guardedPath = guardedPath
	}
}
