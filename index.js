const GameUI = require('./src/app/GameUI')
const Game = require('./src/app/Game')
const GameState = require('./src/app/GameState')
const Logger = require('./src/libs/Logger')
const Prompt = require('./src/libs/Prompt')
const TextLoader = require('./src/libs/TextLoader')
const gameConfig = require('./src/libs/config')
const exitHandler = require('./src/libs/exitHandler')

process.on('uncaughtException', exitHandler(1, 'uncaughtException'))
process.on('unhandledRejection', exitHandler(1, 'unhandledRejection'))

async function main(loader, logger, prompt, config) {
	return new GameUI(new Game(new GameState(config)), loader, logger, prompt).initUI()
}

if (require.main === module) {
	try {
		let textLoader = new TextLoader()
		process.on('SIGINT', exitHandler(0, textLoader.getTextByKey('lose')))
		main(textLoader, new Logger(), new Prompt(), gameConfig)
			.then(exitHandler(0, 'gameEnding'))
			.catch(exitHandler(1, 'mainPromiseRejectionHandled'))
	} catch (syncError) {
		exitHandler(1, 'mainExceptionCaught')(syncError)
	}
}

module.exports = main
