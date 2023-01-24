const TextLoader = require('./src/libs/TextLoader')
const main = require('./index')
const Prompt = require('./src/libs/Prompt')
const Logger = require('./src/libs/Logger')

const fakeRooms = {
	1: { exits: 'West South East' },
	2: { exits: 'West South East' },
	3: { exits: 'West' },
	4: { exits: 'North' },
	5: { exits: 'North South East' },
	6: { exits: 'West South' },
	7: { exits: 'East' },
	8: { exits: 'North West' },
	9: { exits: 'North' }
}

let prompt
let textLoader
let logger
beforeEach(() => {
	prompt = new Prompt()
	prompt.ask = jest.fn()
	logger = new Logger()
	logger.printWithColors = jest.fn()
	process.exit = jest.fn()
	textLoader = new TextLoader()
	textLoader.getTextByKey = jest.fn()
})

describe('Game', () => {
	test('Happy path', async () => {
		textLoader.getTextByKey.mockReturnValueOnce(fakeRooms)
		prompt.ask.mockReturnValueOnce('Angelo')
		prompt.ask.mockReturnValueOnce('move south')
		prompt.ask.mockReturnValueOnce('pick golden calice')
		prompt.ask.mockReturnValueOnce('exit')
		expect(await main(textLoader, logger, prompt)).toEqual(0)
	})
})
