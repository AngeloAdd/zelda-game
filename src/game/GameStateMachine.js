const Room = require('./DTO/Room')
const BASE_COMMANDS = ['move', 'look', 'attack', 'drop', 'pick', 'exit']

module.exports = class StateMachine {
	constructor(state, textLoader) {
		this.state = state
		this.textLoader = textLoader
	}

	updatePlayerName(playerName) {
		this.state.setPlayerName(playerName)
	}

	parseUserCommand(playerCommand) {
		this.state.resetPreviousReaction()
		const fullCommand = playerCommand.toLowerCase().trim()
		let baseCommand = BASE_COMMANDS.filter((el) => fullCommand.includes(el))[0]

		this.updateState(baseCommand, fullCommand)
	}

	updateState(baseCommand, fullCommand) {
		let reaction = null
		switch (baseCommand) {
			case 'move':
				reaction = this.moveToRoom(this.getParam(fullCommand, baseCommand))
				break
			case 'pick':
				reaction = this.pickObject(this.getParam(fullCommand, baseCommand).toUpperCase())
				break
			case 'drop':
				reaction = this.dropObject(this.getParam(fullCommand, baseCommand).toUpperCase())
				break
			case 'attack':
				reaction = this.tryAttack()
				break
			case 'exit':
				reaction = this.exit()
				break
			case 'look':
				reaction =
					"You cautiously scan the room, feeling as if the room's eerie presence is staring at you in return."
				break
			default:
				reaction = 'Invalid command'
				break
		}

		return this.state.setUserCommandReaction(reaction)
	}

	getParam(fullCommand, baseCommand) {
		return fullCommand.replace(baseCommand + ' ', '')
	}

	pickObject(objectName) {
		if (!objectName || objectName === 'PICK') {
			return 'You should specify an object.'
		}
		let objectsByRoom = this.state.getObjectsByRoom()
		if (!objectsByRoom.some((el) => el.name === objectName)) {
			return 'There is no such object in this room to pick up.'
		}

		if (this.state.getPlayerBagStatus().length === 3) {
			return 'Your bag is full you cannot pick up other objects.'
		}

		this.state.objects.forEach((el) => {
			if (el.name === objectName) {
				el.room = null
			}
		})

		return `You picked ${objectName} and put it in your bag.`
	}

	moveToRoom(direction) {
		const room = this.state.getRoomInfo()

		if (!direction || !room.roomExits.includes(direction)) {
			return 'Invalid direction!'
		}

		if ('south' === direction && this.state.getMonsterByRoom()?.alive) {
			return 'The door is protected by the monster'
		}

		const roomNumber = room.roomNumber

		if (roomNumber === 1 && direction === 'west') {
			this.state.gameEndingFor('EndLose')
			return null
		}

		const directionMapToRoomNumberIncrement = {
			south: 3,
			north: -3,
			east: 1,
			west: -1
		}

		let newRoomNumber = roomNumber + directionMapToRoomNumberIncrement[direction]
		this.state.setRoom(new Room(newRoomNumber, this.textLoader.roomsText[newRoomNumber - 1]))
		return `Moving ${direction.toUpperCase()}`
	}

	dropObject(objectName) {
		if (!objectName || objectName === 'DROP') {
			return 'You should specify an object.'
		}

		let objectsInBag = this.state.getPlayerBagStatus()
		if (!objectsInBag.some((el) => el.name === objectName)) {
			return 'There is no such object in your bag.'
		}

		if (this.state.getObjectsByRoom().length === 5) {
			return 'The room is full, you can not drop any object'
		}

		this.state.objects.forEach((el) => {
			if (el.name === objectName) {
				el.room = this.state.currentRoom.roomNumber
			}
		})

		return `You dropped ${objectName} in room number ${this.state.currentRoom.roomNumber}`
	}

	tryAttack() {
		let monsterByRoom = this.state.getMonsterByRoom()
		if (!monsterByRoom) {
			return 'You start moving your arms in the air. Are you ok?'
		}
		let reaction = ''
		if (!this.state.getPlayerBagStatus().some((el) => el.name === monsterByRoom.weakness)) {
			this.state.gameEndingFor('EndDead')
			return monsterByRoom.name === 'Dracula'
				? 'Dracula drains you of your blood while you helplessly struggle to hurt him.'
				: "Medusa's gaze turns you to stone as you foolishly attack her."
		} else {
			this.state.monsters.forEach((el) => {
				if (el.name === monsterByRoom.name) {
					el.alive = false
					reaction = el.defeat
				}
				return el
			})

			return reaction
		}
	}

	exit() {
		if (this.state.currentRoom.roomNumber === 9) {
			this.state.gameEndingFor('EndWin')
			return 'The princess beams with joy as she follows you, eager to put her horrible experience behind her.'
		} else {
			this.state.gameEndingFor('EndLose')
			return 'Exiting the castle...'
		}
	}
}
