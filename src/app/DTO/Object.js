const Locatable = require('./Locatable')

module.exports = class Object extends Locatable {
	constructor(name, roomNumber, value) {
		super(roomNumber)
		this.name = name
		this.value = value
	}
}
