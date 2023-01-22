class GameUI {
	constructor(gameState, gameStateMachine, textLoader, askQuestion, printWithColors) {
		this.gameState = gameState
		this.gameStateMachine = gameStateMachine
		this.textLoader = textLoader
		this.askQuestion = askQuestion
		this.printWithColors = printWithColors
	}

	async start() {
		try {
			this._printStartingMessage()
			await this._askPlayerNameAndUpdateState()
			this._printWelcomeToPlayer()
			await this._waitForUserInteractionAndPrintStatusOrReturnExitCode()
		} catch (e) {
			console.error(e)
			process.exit(1)
		}
	}

	_printStartingMessage() {
		this.printWithColors(this.textLoader.startText, 'magenta')
	}

	async _askPlayerNameAndUpdateState() {
		this.gameStateMachine.updatePlayerName(
			await this.askQuestion('What your name, brave warrior?\n')
		)
	}

	_printWelcomeToPlayer() {
		this.printWithColors(`Welcome ${this.gameState.getPlayerName()}!`)
	}

	async _waitForUserInteractionAndPrintStatusOrReturnExitCode() {
		this._printStatusBasedOnGameState()
		const playerCommand = await this._askPlayerNextCommand()
		await this.gameStateMachine.parseUserCommand(playerCommand)

		if (this.gameState.getUserCommandReaction()) {
			this.printWithColors(this.gameState.getUserCommandReaction())
		}

		if (!this.gameState.isGameRunning) {
			this._displayEndGameMessage()
			return 0
		} else {
			await this._waitForUserInteractionAndPrintStatusOrReturnExitCode()
		}
	}

	_printStatusBasedOnGameState() {
		let roomInfo = this.gameState.getRoomInfo()

		this.printWithColors(roomInfo.roomDescription[0], 'red')
		this.printWithColors(roomInfo.roomDescription[1], 'cyan')

		if (this.gameState.getMonsterByRoom()) {
			this.printWithColors(this.gameState.getMonsterByRoom().getText(), 'blue')
		}

		this.gameState.getObjectsByRoom().forEach((el) => {
			this.printWithColors(`The ${el.name} is lying on the floor.`, 'yellow')
		})

		if (roomInfo.roomNumber === 9) {
			this.printWithColors(
				'The princess trembles in fear as she kneels at the feet of the sacrifice altar, waiting for her fate to be sealed.',
				'blue'
			)
		}

		/*if (!this.gameState.princessIsCaptive) {
			switch (roomInfo.roomNumber) {
				case 5:
					this.printWithColors('The princess turns to the ominous statue with snake-like hairs.')
					break
				case 6:
					this.printWithColors(
						'The princess stares at the pile of dust, wondering what horror it conceals.'
					)
					break
				default:
					this.printWithColors('The princess looks at you with hope in her eyes.')
					break
			}
		}*/

		let playerBagStatus = this.gameState.getPlayerBagStatus()
		this.printWithColors(`Your bag contains ${playerBagStatus.length}/3 items:`, 'green')
		playerBagStatus.forEach((el) => this.printWithColors(el.name, 'green'))
		this.printWithColors(
			`Current cash: ${playerBagStatus.reduce((acc, cur) => cur.value + acc, 0)}`,
			'gray'
		)
	}

	async _askPlayerNextCommand() {
		return this.askQuestion('What do you want to do?\n')
	}

	_displayEndGameMessage() {
		this.printWithColors(this.textLoader.getByEndCause(this.gameState.endCause), 'magenta')
	}
}

module.exports = GameUI
