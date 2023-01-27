const TextLoader = require('./src/libs/TextLoader')
const main = require('./index')
const Prompt = require('./src/libs/Prompt')
const Logger = require('./src/libs/Logger')
const config = require('./src/libs/config')

let prompt
let textLoader
let logger
beforeEach(() => {
	prompt = new Prompt()
	logger = new Logger()
	logger.printWithColors = jest.fn()
	textLoader = new TextLoader()
	process.exit = jest.fn()
	prompt.ask = jest.fn()
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('Game', () => {
	test('Happy path', async () => {
		;[
			'Angelo',
			'move south',
			'pick golden calice',
			'move north',
			'move east',
			'pick golden egg',
			'move east',
			'pick mirror shield',
			'move west',
			'move south',
			'attack',
			'move south',
			'move west',
			'drop mirror shield',
			'pick silver dagger',
			'move east',
			'move north',
			'move east',
			'attack',
			'move west',
			'move south',
			'drop silver dagger',
			'pick dusty proof',
			'move north',
			'move east',
			'move south',
			'exit'
		].forEach((el) => prompt.ask.mockReturnValueOnce(el))

		const result = await main(textLoader, logger, prompt, config)
		expect(result).toEqual(0)
		expect(logger.printWithColors).toHaveBeenCalledWith(
			`You lead the princess out of the castle safe and sound, her trust in you will never waver.
YOU WIN!!!
`,
			'magenta'
		)
	})
	test.each([
		['pick golden calice', 'There is no such object in this room to pick up.'],
		['ciaciao', 'Invalid command. You can use LOOK, ATTACK, PICK, DROP, MOVE, EXIT!'],
		['pick', 'You should specify an object.'],
		['drop', 'You should specify an object.'],
		['drop golden egg', 'There is no such object in your bag.'],
		['movesouth', 'Invalid command. You can use LOOK, ATTACK, PICK, DROP, MOVE, EXIT!'],
		['move', 'Invalid direction!'],
		['move north', 'Invalid direction!']
	])('Various invalid moves: %s', async (invalidMove, response) => {
		;['Angelo', invalidMove, 'exit'].forEach((el) => prompt.ask.mockReturnValueOnce(el))

		const result = await main(textLoader, logger, prompt, config)
		expect(result).toEqual(0)
		expect(logger.printWithColors).toHaveBeenCalledWith(response, 'magenta', '', 'bright')
	})
	test('End by losing', async () => {
		;['Angelo', 'exit'].forEach((el) => prompt.ask.mockReturnValueOnce(el))

		const result = await main(textLoader, logger, prompt, config)
		expect(result).toEqual(0)
		expect(logger.printWithColors).toHaveBeenNthCalledWith(
			8,
			`You exit the castle happily finally enjoying the fresh air, but suddenly you remember: Ops! The princess!
You lost!!
GAME OVER
`,
			'magenta'
		)
	})
	test('Died by Dracula', async () => {
		;[
			'Angelo',
			'move south',
			'pick golden calice',
			'move north',
			'move east',
			'pick golden egg',
			'move east',
			'pick mirror shield',
			'move west',
			'move south',
			'attack',
			'move east',
			'attack'
		].forEach((el) => prompt.ask.mockReturnValueOnce(el))

		const result = await main(textLoader, logger, prompt, config)
		expect(result).toEqual(0)
		expect(logger.printWithColors).toHaveBeenNthCalledWith(
			90,
			'Dracula drains you of your blood while you helplessly struggle to hurt him.',
			'magenta',
			'',
			'bright'
		)
		expect(logger.printWithColors).toHaveBeenNthCalledWith(
			91,
			`You Are Dead!!
GAME OVER
`,
			'magenta'
		)
	})
	test('Died by Medusa', async () => {
		;['Angelo', 'move east', 'move south', 'attack'].forEach((el) => prompt.ask.mockReturnValueOnce(el))

		const result = await main(textLoader, logger, prompt, config)
		expect(result).toEqual(0)
		expect(logger.printWithColors).toHaveBeenNthCalledWith(
			19,
			"Medusa's gaze turns you to stone as you foolishly attack her.",
			'magenta',
			'',
			'bright'
		)
		expect(logger.printWithColors).toHaveBeenNthCalledWith(
			20,
			`You Are Dead!!
GAME OVER
`,
			'magenta'
		)
	})
})
