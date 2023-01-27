const PlayerCommand = require('./utils/PlayerCommand')
const ucFirst = require('./utils/ucFirst')

module.exports = class GameUI {
	constructor(game, loader, logger, prompt) {
		this.game = game
		this.textLoader = loader
		this.logger = logger
		this.prompt = prompt
	}

	async initUI() {
		try {
			this._displayStartingMessage()
			const playerName = await this._askPlayerName()
			this._displayGameResponse(['player.nameResponse', { playerName }])
			return this._handlePlayerCommand()
		} catch (e) {
			console.error(e)
			return 1
		}
	}

	_displayStartingMessage() {
		this.logger.printWithColors(this.textLoader.getTextByKey('startingText'), 'magenta')
	}

	async _handlePlayerCommand() {
		this._displayStatus()
		const playerCommand = await this._askPlayerNextCommand()
		const response = this.game.parseUserCommand(new PlayerCommand(playerCommand))

		if (response) {
			this._displayGameResponse(response)
		}

		if (!this.game.state.isRunning) {
			this._displayEndGameMessage()
			return 0
		} else {
			return await this._handlePlayerCommand()
		}
	}

	_displayGameResponse(response) {
		this.logger.printNewLine()
		this.logger.printWithColors(this.textLoader.getTextByKey(...response), 'magenta', '', 'bright')
		this.logger.printNewLine()
	}

	_displayStatus() {
		let roomInfo = this.game.state.getCurrentRoom()

		this.logger.printWithColors(
			this.textLoader.getTextByKey(`rooms.${roomInfo.roomCoordinates.toIndex(roomInfo.side)}`),
			'red'
		)

		let roomExit = []
		roomInfo.roomExits.forEach((el) => {
			if (roomInfo.isFirst() && el === 'West') {
				roomExit.push(this.textLoader.getTextByKey('move.lose'))
			} else {
				roomExit.push(this.textLoader.getTextByKey('commands.move.exits', { direction: ucFirst(el) }))
			}
		})
		let exits = roomExit.join(', ')
		this.logger.printWithColors(`${ucFirst(exits)}.`, 'cyan')

		let monsterByRoom = this.game.state.getMonsterInCurrentRoom()
		if (monsterByRoom) {
			let textToPrint = monsterByRoom.name.toLowerCase() + '.'
			textToPrint += monsterByRoom.alive ? 'alive' : 'dead'
			this.logger.printWithColors(this.textLoader.getTextByKey(textToPrint), 'blue')
		}

		this.game.state.getObjectsInCurrentRoom().forEach((el) => {
			this.logger.printWithColors(this.textLoader.getTextByKey('object.laying', { objectName: el.name }), 'yellow')
		})

		if (roomInfo.isLast()) {
			this.logger.printWithColors(this.textLoader.getTextByKey('princess.waiting'), 'blue')
		}

		let playerBagStatus = this.game.state.getObjectsInPlayerBag()
		this.logger.printWithColors(
			this.textLoader.getTextByKey('bag.capacity', {
				itemsNumber: playerBagStatus.length,
				capacity: 3
			}),
			'green'
		)
		playerBagStatus.forEach((el) => this.logger.printWithColors(el.name, 'green'))
		this.logger.printWithColors(
			this.textLoader.getTextByKey('cashStatus', {
				amount: playerBagStatus.reduce((acc, cur) => cur.value + acc, 0)
			}),
			'gray'
		)
	}

	async _askPlayerNextCommand() {
		return this.prompt.ask(this.textLoader.getTextByKey('player.question'))
	}

	_displayEndGameMessage() {
		this.logger.printWithColors(this.textLoader.getTextByKey(this.game.state.endingReason), 'magenta')
	}

	async _askPlayerName() {
		return this.prompt.ask(this.textLoader.getTextByKey('player.nameQuestion'))
	}
}
