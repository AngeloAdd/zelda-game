const Logger = require('./Logger')

let logger
beforeEach(() => {
	logger = new Logger()
})

afterEach(() => {
	logger = null
})

describe('Calling logger', () => {
	test("with message 'ciao' and color red console.log is called with shell red color code as prefix", () => {
		console.log = jest.fn()
		logger.printWithColors('ciao', 'red')
		expect(console.log).toHaveBeenCalledWith('\x1b[31mciao\x1b[0m')
	})
	test("with message 'ciao' and invalid color console.log is called with empty string as prefix", () => {
		console.log = jest.fn()
		logger.printWithColors('ciao', 'invalid')
		expect(console.log).toHaveBeenCalledWith('ciao\x1b[0m')
	})
	test('with error it logs error and exits process', () => {
		console.log = jest.fn()
		console.error = jest.fn()
		process.exit = jest.fn()

		console.log.mockImplementation(() => {
			throw new Error('Ciao')
		})
		logger.printWithColors('ciao', 'red')
		expect(console.error).toHaveBeenCalledWith(new Error('Ciao'))
		expect(process.exit).toHaveBeenCalledWith(1)
	})
})
