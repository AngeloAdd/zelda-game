const util = require('node:util')
const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
})
const prompt = util.promisify(rl.question).bind(rl)

module.exports = class Prompt {
	constructor() {}

	async ask(question) {
		let answer
		try {
			answer = await prompt('\x1b[1m' + question + ' : \x1b[0m')
		} catch (e) {
			console.error(e)
			process.exit(1)
		}

		return answer
	}
}
