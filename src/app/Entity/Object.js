const Locatable = require('./Locatable')

module.exports = class Object extends Locatable {
	constructor(name, roomCoordinates, value) {
		super(roomCoordinates)
		this.name = name
		this.value = value
	}
}
