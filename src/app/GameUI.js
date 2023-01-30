const PlayerCommand = require('./utils/PlayerCommand')
const ucFirst = require('./utils/ucFirst')
const Difficulty = require('./utils/Difficulty')

const SUCCESS_EXIT = 0
const FAIL_EXIT = 1

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
			const difficulty = new Difficulty(await this._askPlayerToSelectDifficulty())
			this._initializeStateWithDifficulty(difficulty)
			return this._handlePlayerCommand()
		} catch (e) {
			console.error(e)
			return FAIL_EXIT
		}
	}

	_initializeStateWithDifficulty(difficulty) {
		this.game.initializeState(difficulty.toString())
		this._displayGameResponse(['player.difficulty', { difficulty }])
	}

	async _askPlayerToSelectDifficulty() {
		return await this.prompt.ask('Select a difficulty level and press enter (1.easy, 2.normal)')
	}

	_displayStartingMessage() {
		this.logger.printWithColors(this.textLoader.getTextByKey('startingText'), 'magenta')
	}

	async _handlePlayerCommand() {
		this._displayStatus(this.game.state)

		const playerCommand = await this._askPlayerNextCommand()
		const response = this.game.parseUserCommand(new PlayerCommand(playerCommand))

		if (response) {
			this._displayGameResponse(response)
		}

		if (!this.game.state.isRunning) {
			this._displayEndGameMessage()
			return SUCCESS_EXIT
		} else {
			return await this._handlePlayerCommand()
		}
	}

	_displayGameResponse(response) {
		this.logger.printNewLine()
		this.logger.printWithColors(this.textLoader.getTextByKey(...response), 'magenta', '', 'bright')
		this.logger.printNewLine()
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

	_displayStatus(state) {
		let roomInfo = state.getCurrentRoom()
		this._displayRoomDescription(roomInfo)
		this._displayRoomExits(roomInfo)
		this._displayRoomMonsterIfExists(state.getMonsterInCurrentRoom())
		this._displayRoomObjectsIfExist(state.getObjectsInCurrentRoom())
		this._displayPrincessIfExists(roomInfo)
		this._displayPlayerBagContentAndValue(state.getObjectsInPlayerBag())
	}

	_displayPlayerBagContentAndValue(playerBagStatus) {
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

	_displayPrincessIfExists(roomInfo) {
		if (roomInfo.isLast()) {
			this.logger.printWithColors(this.textLoader.getTextByKey('princess.waiting'), 'blue')
		}
	}

	_displayRoomObjectsIfExist(objects) {
		objects.forEach((el) => {
			this.logger.printWithColors(this.textLoader.getTextByKey('object.laying', { objectName: el.name }), 'yellow')
		})
	}

	_displayRoomMonsterIfExists(monsterByRoom) {
		if (monsterByRoom) {
			this.logger.printWithColors(
				this.textLoader.getTextByKey(`${monsterByRoom.name}.${monsterByRoom.alive ? 'alive' : 'dead'}`),
				'blue'
			)
		}
	}

	_displayRoomDescription(roomInfo) {
		this.logger.printWithColors(this.textLoader.getTextByKey(`rooms.${roomInfo.index()}`), 'red')
	}

	_displayRoomExits(roomInfo) {
		const exitsText = []
		if (roomInfo.isFirst() && roomInfo.hasExit('west')) {
			exitsText.push(this.textLoader.getTextByKey('commands.move.lose'))
		}

		for (const roomInfoKey in roomInfo.roomExits) {
			if (roomInfo.roomExits[roomInfoKey] && !(roomInfo.isFirst() && roomInfoKey === 'west')) {
				exitsText.push(this.textLoader.getTextByKey('commands.move.exits', { direction: ucFirst(roomInfoKey) }))
			}
		}

		return this.logger.printWithColors(`${ucFirst(exitsText.join(', '))}.`, 'cyan')
	}
}
