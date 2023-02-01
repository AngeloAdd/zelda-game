module.exports = class Game {
	constructor(factory) {
		this.factory = factory
		this.state = null
	}

	initializeState(difficulty) {
		this.state = this.factory.createWithDifficulty(difficulty)
	}

	parseUserCommand(playerCommand) {
		switch (playerCommand.command()) {
			case 'move':
				return this._moveWithDirection(playerCommand.parameter())
			case 'pick':
				return this._pickObject(playerCommand.parameter().toUpperCase())
			case 'drop':
				return this._dropObject(playerCommand.parameter().toUpperCase())
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

	_moveWithDirection(direction) {
		const room = this.state.getCurrentRoom()

		if (!direction) {
			return ['commands.move.required']
		}

		if (!room.hasExit(direction)) {
			return ['commands.move.invalid']
		}

		if (this.state.getMonsterInCurrentRoom()?.alive && this.state.getMonsterInCurrentRoom().guardedPath === direction) {
			return ['commands.move.closed']
		}

		if (room.isFirst() && direction === 'west') {
			this.state.setGameEnding('lose')
			return null
		}

		this.state.setCurrentRoomByNumber(room.roomCoordinates.to(direction))

		return ['commands.move.success', { direction: direction.toUpperCase() }]
	}

	_pickObject(objectName) {
		if (!objectName) {
			return ['commands.pick.param']
		}
		let objectsByRoom = this.state.getObjectsInCurrentRoom()
		if (!objectsByRoom.some((el) => el.name === objectName)) {
			return ['commands.pick.miss']
		}

		const numberOfObjectsInTheRoom = this.state.getObjectsInCurrentRoom().filter((el) => el.name === objectName).length
		if (this.state.isPlayerBagFull(numberOfObjectsInTheRoom)) {
			return ['commands.pick.full']
		}

		this.state.pickObject(objectName)

		return ['commands.pick.success', { objectName: `${objectName} x${numberOfObjectsInTheRoom}` }]
	}

	_dropObject(objectName) {
		if (!objectName) {
			return ['commands.drop.param']
		}

		let objectsInBag = this.state.getObjectsInPlayerBag()
		if (!objectsInBag.some((el) => el.name === objectName)) {
			return ['commands.drop.miss']
		}

		const numberOfObjectsToDrop = this.state.getObjectsInPlayerBag().filter((el) => el.name === objectName).length
		if (this.state.isRoomFull(numberOfObjectsToDrop)) {
			return ['commands.drop.full']
		}

		this.state.dropObject(objectName)

		return ['commands.drop.success', { objectName: `${objectName} x${numberOfObjectsToDrop}` }]
	}

	_attack() {
		let monsterByRoom = this.state.getMonsterInCurrentRoom()

		if (!monsterByRoom) {
			return ['commands.attack.null']
		}

		if (!this.state.getObjectsInPlayerBag().some((el) => el.name === monsterByRoom.weakness)) {
			this.state.setGameEnding('dead')
			return ['commands.attack.defeat.' + monsterByRoom.name]
		}

		this.state.killMonster(monsterByRoom.name)

		return ['commands.attack.success.' + monsterByRoom.name]
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
