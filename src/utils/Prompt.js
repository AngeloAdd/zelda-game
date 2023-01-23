const util = require('node:util')
const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
})
const prompt = util.promisify(rl.question).bind(rl)

module.exports = class Prompt {
	constructor(logger) {
		this.logger = logger
	}

	async ask(question) {
		let answer
		try {
			this.logger.printWithColors(question, '', '', 'bright')
			answer = await prompt('')
		} catch (e) {
			console.error(e)
			process.exit(1)
		}

		return answer
	}
}
