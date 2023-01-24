const GameUI = require('./src/app/GameUI')
const Game = require('./src/app/Game')
const GameState = require('./src/app/GameState')
const Logger = require('./src/libs/Logger')
const Prompt = require('./src/libs/Prompt')
const TextLoader = require('./src/libs/TextLoader')
const gameConfig = require('./src/libs/Config')

async function main(loader, logger, prompt, config) {
	return new GameUI(new Game(new GameState(config)), loader, logger, prompt).initUI()
}

if (require.main === module) {
	try {
		main(new TextLoader(), new Logger(), new Prompt(), gameConfig)
			.then((code) => process.exit(code))
			.catch((asyncError) => console.error('main: ', asyncError))
	} catch (syncError) {
		console.error('syncMain:', syncError)
		process.exit(1)
	}
}

module.exports = main
