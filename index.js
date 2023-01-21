const GameUI = require('./src/game/GameUI')
const StateMachine = require('./src/game/GameStateMachine')
const askQuestion = require('./src/utils/askQuestion')

let textLoader
try{
  textLoader = require('./src/utils/TextLoader')
}catch(e){
  console.error(e)
  process.exit(e?.code ?? 1)
}
const gameState = require('./src/game/GameState/index').getInstance(textLoader)

async function startGame(aq){
  return new GameUI(
      gameState,
      new StateMachine(gameState, textLoader),
      textLoader,
      aq
  ).playSteps()
}

if(require.main === module){
  startGame(askQuestion)
      .then(process.exit)
      .catch(console.error)
}

module.exports = startGame
