class GameUI {
	constructor(gameState, gameStateMachine, textLoader, logger, prompt) {
		this.gameState = gameState
		this.gameStateMachine = gameStateMachine
		this.textLoader = textLoader
		this.logger = logger
		this.prompt = prompt
	}

	async start() {
		try {
			this._displayStartingMessage()
			const playerName = await this._askPlayerName()
			this._displayGameResponse(
				this.textLoader.getTextByKey('player_name_response', { playerName })
			)
			return this._handlePlayerCommand()
		} catch (e) {
			console.error(e)
			return 1
		}
	}

	_displayStartingMessage() {
		this.logger.printWithColors(this.textLoader.getTextByKey('starting_text'), 'magenta')
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
			await this._handlePlayerCommand()
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

		if (this.gameState.getMonsterByRoom()) {
			this.logger.printWithColors(this.gameState.getMonsterByRoom().getText(), 'blue')
		}

		this.gameState.getObjectsByRoom().forEach((el) => {
			this.logger.printWithColors(`The ${el.name} is lying on the floor.`, 'yellow')
		})

		if (roomInfo.roomNumber === 9) {
			this.logger.printWithColors(
				'The princess trembles in fear as she kneels at the feet of the sacrifice altar, waiting for her fate to be sealed.',
				'blue'
			)
		}

		let playerBagStatus = this.gameState.getPlayerBagStatus()
		this.logger.printWithColors(`Your bag contains ${playerBagStatus.length}/3 items:`, 'green')
		playerBagStatus.forEach((el) => this.logger.printWithColors(el.name, 'green'))
		this.logger.printWithColors(
			`Current cash: ${playerBagStatus.reduce((acc, cur) => cur.value + acc, 0)}`,
			'gray'
		)
	}

	async _askPlayerNextCommand() {
		return this.prompt.ask('What do you want to do?')
	}

	_displayEndGameMessage() {
		this.logger.printWithColors(this.textLoader.getByEndCause(this.gameState.endCause), 'magenta')
	}

	async _askPlayerName() {
		return this.prompt.ask(this.textLoader.getTextByKey('player_name'))
	}
}

module.exports = GameUI
