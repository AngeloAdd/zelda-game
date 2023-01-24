const BASE_COMMANDS = ['move', 'look', 'attack', 'drop', 'pick', 'exit']
const MAP_DIRECTION_TO_ROOM_INCREMENT = {
	south: 3,
	north: -3,
	east: 1,
	west: -1
}

module.exports = class Game {
	constructor(state) {
		this.state = state
	}

	parseUserCommand(playerCommand) {
		const fullCommand = playerCommand.toLowerCase().trim()
		const baseCommand = BASE_COMMANDS.filter(
			(el) => fullCommand.split(' ').filter((com) => com === el)[0]
		)[0]
		const param = this._getParam(fullCommand, baseCommand)

		return this._updateState(baseCommand, param)
	}

	_updateState(baseCommand, param) {
		switch (baseCommand) {
			case 'move':
				return this._moveWithDirection(param)
			case 'pick':
				return this._pickObject(param.toUpperCase())
			case 'drop':
				return this._dropObject(param.toUpperCase())
			case 'attack':
				return this._attack()
			case 'exit':
				return this._exit()
			case 'look':
				return this._look()
			default:
				return ['commands.invalid']
		}
	}

	_getParam(fullCommand, baseCommand) {
		const param = fullCommand
			.split(' ')
			.filter((el) => !el.includes(baseCommand))
			.join(' ')
			.trim()
		return param.includes(baseCommand) ? null : param
	}

	_pickObject(objectName) {
		if (!objectName) {
			return ['commands.pick.param']
		}
		let objectsByRoom = this.state.getObjectsInCurrentRoom()
		if (!objectsByRoom.some((el) => el.name === objectName)) {
			return ['commands.pick.miss']
		}

		if (this.state.getObjectsInPlayerBag().length === 3) {
			return ['commands.pick.full']
		}

		this.state.pickObject(objectName)

		return ['commands.pick.success', { objectName }]
	}

	_moveWithDirection(direction) {
		const room = this.state.getCurrentRoom()

		if (!direction || !room.hasExit(direction)) {
			return ['commands.move.invalid']
		}

		if ('south' === direction && this.state.getMonsterInCurrentRoom()?.alive) {
			return ['commands.move.closed']
		}

		if (room.isFirst() && direction === 'west') {
			this.state.setGameEnding('lose')
			return null
		}

		let newRoomNumber = room.roomNumber + MAP_DIRECTION_TO_ROOM_INCREMENT[direction]
		this.state.setCurrentRoomByNumber(newRoomNumber)

		return ['commands.move.success', { direction: direction.toUpperCase() }]
	}

	_dropObject(objectName) {
		if (!objectName) {
			return ['commands.drop.param']
		}

		let objectsInBag = this.state.getObjectsInPlayerBag()
		if (!objectsInBag.some((el) => el.name === objectName)) {
			return ['commands.drop.miss']
		}

		if (this.state.getObjectsInCurrentRoom().length === 5) {
			return ['commands.drop.full']
		}

		this.state.dropObject(objectName)

		return ['commands.drop.success', { objectName }]
	}

	_attack() {
		let monsterByRoom = this.state.getMonsterInCurrentRoom()

		if (!monsterByRoom) {
			return ['commands.attack.null']
		}

		if (!this.state.getObjectsInPlayerBag().some((el) => el.name === monsterByRoom.weakness)) {
			this.state.setGameEnding('dead')
			return ['commands.attack.defeat.' + monsterByRoom.name.toLowerCase()]
		}

		this.state.killMonster(monsterByRoom.name)

		return ['commands.attack.success.' + monsterByRoom.name.toLowerCase()]
	}

	_exit() {
		if (this.state.getCurrentRoom().isLast()) {
			this.state.setGameEnding('win')
			return ['commands.exit.win']
		} else {
			this.state.setGameEnding('lose')
			return ['commands.exit.lose']
		}
	}

	_look() {
		return ['commands.look']
	}
}
