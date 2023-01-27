const locate = require('../utils/locate')

module.exports = class MonstersCollection {
	constructor(monsters) {
		this.monsters = monsters
	}

	findByRoomCoordinates(roomCoordinates) {
		return this.monsters.find(locate(roomCoordinates)) ?? null
	}

	setDeadByMonsterName(monsterName) {
		this.monsters.forEach((el) => {
			if (el.name === monsterName) {
				el.alive = false
			}
			return el
		})
	}
}
