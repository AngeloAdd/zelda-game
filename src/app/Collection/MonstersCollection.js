const Monster = require('../DTO/Monster')
module.exports = class MonstersCollection {
	constructor(monsters) {
		this.monsters = monsters
	}

	static fromArray(items) {
		return new MonstersCollection(
			items.map((el) => {
				return new Monster(el.name, el.room, true, el.weakness)
			})
		)
	}

	findByRoom(roomNumber) {
		return this.monsters.filter((el) => el.room === roomNumber)[0] ?? null
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
