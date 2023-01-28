module.exports = class Exits {
	constructor(arrayOfExits) {
		this.north = arrayOfExits.includes('north')
		this.east = arrayOfExits.includes('east')
		this.south = arrayOfExits.includes('south')
		this.west = arrayOfExits.includes('west')
	}
}
