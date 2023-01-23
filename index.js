const GameUI = require('./src/game/GameUI')
const StateMachine = require('./src/game/GameStateMachine')
const GameState = require('./src/game/GameState')
const Logger = require('./src/utils/Logger')
const Prompt = require('./src/utils/Prompt')

let textLoader
try {
	textLoader = require('./src/utils/TextLoader')
} catch (e) {
	console.error(e)
	process.exit(e?.code ?? 1)
}

const gameState = new GameState(textLoader)

let logger = new Logger()

const gameUI = new GameUI(
	gameState,
	new StateMachine(gameState, textLoader),
	textLoader,
	logger,
	new Prompt(logger)
)

async function main(game) {
	return game.start()
}

main(gameUI).then(process.exit).catch(console.error)
