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
		const baseCommand = BASE_COMMANDS.filter((el) => fullCommand.includes(el))[0]
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
				return 'Invalid command'
		}
	}

	_getParam(fullCommand, baseCommand) {
		return fullCommand
			.split(' ')
			.filter((el) => !el.includes(baseCommand))
			.join(' ')
			.trim()
	}

	_pickObject(objectName) {
		if (!objectName) {
			return 'You should specify an object.'
		}
		let objectsByRoom = this.state.getObjectsInCurrentRoom()
		if (!objectsByRoom.some((el) => el.name === objectName)) {
			return 'There is no such object in this room to pick up.'
		}

		if (this.state.getObjectsInPlayerBag().length === 3) {
			return 'Your bag is full you cannot pick up other objects.'
		}

		this.state.pickObject(objectName)

		return `You picked ${objectName} and put it in your bag.`
	}

	_moveWithDirection(direction) {
		const room = this.state.getCurrentRoom()

		if (!direction || !room.hasExit(direction)) {
			return 'Invalid direction!'
		}

		if ('south' === direction && this.state.getMonsterInCurrentRoom()?.alive) {
			return 'The door is protected by the monster'
		}

		if (room.isFirst() && direction === 'west') {
			this.state.setGameEnding('lose')
			return null
		}

		let newRoomNumber = room.roomNumber + MAP_DIRECTION_TO_ROOM_INCREMENT[direction]
		this.state.setCurrentRoomByNumber(newRoomNumber)

		return `Moving ${direction.toUpperCase()}`
	}

	_dropObject(objectName) {
		if (!objectName) {
			return 'You should specify an object.'
		}

		let objectsInBag = this.state.getObjectsInPlayerBag()
		if (!objectsInBag.some((el) => el.name === objectName)) {
			return 'There is no such object in your bag.'
		}

		if (this.state.getObjectsInCurrentRoom().length === 5) {
			return 'The room is full, you can not drop any object'
		}

		this.state.dropObject(objectName)

		return `You dropped ${objectName} in room number ${this.state.getCurrentRoom().roomNumber}`
	}

	_attack() {
		let monsterByRoom = this.state.getMonsterInCurrentRoom()

		if (!monsterByRoom) {
			return 'You start moving your arms in the air. Are you ok?'
		}

		if (!this.state.getObjectsInPlayerBag().some((el) => el.name === monsterByRoom.weakness)) {
			this.state.setGameEnding('dead')
			return monsterByRoom.name === 'Dracula'
				? 'Dracula drains you of your blood while you helplessly struggle to hurt him.'
				: "Medusa's gaze turns you to stone as you foolishly attack her."
		}

		this.state.killMonster(monsterByRoom.name)

		return monsterByRoom.name === 'Dracula'
			? 'The powerful vampire exudes an eerie silence as his body slowly disintegrates into dust.'
			: "Medusa's eyes widen in horror as she realizes that her curse has now been turned against her."
	}

	_exit() {
		if (this.state.getCurrentRoom().isLast()) {
			this.state.setGameEnding('win')
			return 'The princess beams with joy as she follows you, eager to put her horrible experience behind her.'
		} else {
			this.state.setGameEnding('lose')
			return 'Exiting the castle...'
		}
	}

	_look() {
		return "You cautiously scan the room, feeling as if the room's eerie presence is staring at you in return."
	}
}
