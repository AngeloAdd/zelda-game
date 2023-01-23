const GameUI = require('./src/app/GameUI')
const StateMachine = require('./src/app/GameStateMachine')
const GameState = require('./src/app/GameState')
const Logger = require('./src/libs/Logger')
const Prompt = require('./src/libs/Prompt')
const TextLoader = require('./src/libs/TextLoader')

async function main(loader, logger, prompt) {
	return new GameUI(new StateMachine(new GameState(loader)), logger, prompt).start()
}

if (require.main === module) {
	try {
		main(new TextLoader(), new Logger(), new Prompt())
			.then((code) => process.exit(code))
			.catch((asyncError) => console.error(asyncError))
	} catch (syncError) {
		console.error(syncError)
		process.exit(1)
	}
}

module.exports = main
