class GameUI {
	constructor(gameStateMachine, logger, prompt) {
		this.gameStateMachine = gameStateMachine
		this.logger = logger
		this.prompt = prompt

		this.gameState = gameStateMachine.state
		this.textLoader = this.gameState.textLoader
	}

	async start() {
		try {
			this._displayStartingMessage()
			const playerName = await this._askPlayerName()
			this._displayGameResponse(this.textLoader.getTextByKey('player.nameResponse', { playerName }))
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
		this._displayGameStatus()
		const playerCommand = await this._askPlayerNextCommand()
		const response = this.gameStateMachine.parseUserCommand(playerCommand)

		if (response) {
			this._displayGameResponse(response)
		}

		if (!this.gameState.isGameRunning) {
			this._displayEndGameMessage()
			return 0
		} else {
			return await this._handlePlayerCommand()
		}
	}

	_displayGameResponse(response) {
		this.logger.printNewLine()
		this.logger.printWithColors(response, 'magenta', '', 'bright')
		this.logger.printNewLine()
	}

	_displayGameStatus() {
		let roomInfo = this.gameState.getRoomInfo()

		this.logger.printWithColors(roomInfo.roomDescription[0], 'red')
		this.logger.printWithColors(roomInfo.roomDescription[1], 'cyan')

		let monsterByRoom = this.gameState.getMonsterByRoom()
		if (monsterByRoom) {
			let textToPrint = monsterByRoom.name.toLowerCase() + '.'
			textToPrint += monsterByRoom.alive ? 'alive' : 'dead'
			this.logger.printWithColors(this.textLoader.getTextByKey(textToPrint), 'blue')
		}

		this.gameState.getObjectsByRoom().forEach((el) => {
			this.logger.printWithColors(
				this.textLoader.getTextByKey('object.laying', { objectName: el.name }),
				'yellow'
			)
		})

		if (roomInfo.roomNumber === 9) {
			this.logger.printWithColors(this.textLoader.getTextByKey('princess.waiting'), 'blue')
		}

		let playerBagStatus = this.gameState.getPlayerBagStatus()
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
		this.logger.printWithColors(this.textLoader.getByEndCause(this.gameState.endCause), 'magenta')
	}

	async _askPlayerName() {
		return this.prompt.ask(this.textLoader.getTextByKey('player.nameQuestion'))
	}
}

module.exports = GameUI
