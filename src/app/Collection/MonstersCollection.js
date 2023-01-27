const locate = require('../utils/locate')

module.exports = class MonstersCollection {
	constructor(monsters) {
		this.monsters = monsters
	}

	findByRoom(roomNumber) {
		return this.monsters.find(locate(roomNumber)) ?? null
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
