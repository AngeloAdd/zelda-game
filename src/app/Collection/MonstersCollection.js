const Monster = require('../DTO/Monster')
const locate = require('../utils/locate')

module.exports = class MonstersCollection {
	constructor(monsters) {
		this.monsters = monsters
	}

	static fromArray(items) {
		return new MonstersCollection(
			items.map((el) => {
				return new Monster(el.name, el.roomNumber, true, el.weakness, el.guardedPath)
			})
		)
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
