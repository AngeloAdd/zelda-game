class GameUI {
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
		this._displayStatus()
		const playerCommand = await this._askPlayerNextCommand()
		const response = this.game.parseUserCommand(playerCommand)

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
		this.logger.printWithColors(response, 'magenta', '', 'bright')
		this.logger.printNewLine()
	}

	_displayStatus() {
		let roomInfo = this.game.state.getRoomInfo()

		this.logger.printWithColors(
			this.textLoader.getTextByKey(`rooms.${roomInfo.roomNumber}.description`),
			'red'
		)
		this.logger.printWithColors(roomInfo.roomExits, 'cyan')

		let monsterByRoom = this.game.state.getMonsterByRoom()
		if (monsterByRoom) {
			let textToPrint = monsterByRoom.name.toLowerCase() + '.'
			textToPrint += monsterByRoom.alive ? 'alive' : 'dead'
			this.logger.printWithColors(this.textLoader.getTextByKey(textToPrint), 'blue')
		}

		this.game.state.getObjectsByRoom().forEach((el) => {
			this.logger.printWithColors(
				this.textLoader.getTextByKey('object.laying', { objectName: el.name }),
				'yellow'
			)
		})

		if (roomInfo.roomNumber === 9) {
			this.logger.printWithColors(this.textLoader.getTextByKey('princess.waiting'), 'blue')
		}

		let playerBagStatus = this.game.state.getPlayerBagStatus()
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
		this.logger.printWithColors(
			this.textLoader.getTextByKey(this.game.state.endingReason),
			'magenta'
		)
	}

	async _askPlayerName() {
		return this.prompt.ask(this.textLoader.getTextByKey('player.nameQuestion'))
	}
}

module.exports = GameUI
