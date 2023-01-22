const GameUI = require('./src/game/GameUI')
const StateMachine = require('./src/game/GameStateMachine')
const GameState = require('./src/game/GameState')
const askQuestion = require('./src/utils/askQuestion')
const printWithColors = require('./src/utils/printWithColors')

let textLoader
try {
	textLoader = require('./src/utils/TextLoader')
} catch (e) {
	console.error(e)
	process.exit(e?.code ?? 1)
}
const gameState = new GameState(textLoader)

const gameUI = new GameUI(
	gameState,
	new StateMachine(gameState, textLoader),
	textLoader,
	askQuestion,
	printWithColors
)

async function main(game) {
	return game.start()
}

main(gameUI).then(process.exit).catch(console.error)
