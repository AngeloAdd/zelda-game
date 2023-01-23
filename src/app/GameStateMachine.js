const Room = require('./DTO/Room')
const BASE_COMMANDS = ['move', 'look', 'attack', 'drop', 'pick', 'exit']

module.exports = class StateMachine {
	constructor(state) {
		this.state = state

		this.textLoader = this.state.textLoader
	}

	parseUserCommand(playerCommand) {
		const fullCommand = playerCommand.toLowerCase().trim()
		let baseCommand = BASE_COMMANDS.filter((el) => fullCommand.includes(el))[0]

		return this.updateState(baseCommand, fullCommand)
	}

	updateState(baseCommand, fullCommand) {
		switch (baseCommand) {
			case 'move':
				return this.moveWithDirection(this.getParam(fullCommand, baseCommand))
			case 'pick':
				return this.pickObject(this.getParam(fullCommand, baseCommand).toUpperCase())
			case 'drop':
				return this.dropObject(this.getParam(fullCommand, baseCommand).toUpperCase())
			case 'attack':
				return this.attack()
			case 'exit':
				return this.exit()
			case 'look':
				return this.look()
			default:
				return 'Invalid command'
		}
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

	moveWithDirection(direction) {
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

	attack() {
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
					reaction =
						monsterByRoom.name === 'Dracula'
							? 'The powerful vampire exudes an eerie silence as his body slowly disintegrates into dust.'
							: "Medusa's eyes widen in horror as she realizes that her curse has now been turned against her."
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

	look() {
		return "You cautiously scan the room, feeling as if the room's eerie presence is staring at you in return."
	}
}
