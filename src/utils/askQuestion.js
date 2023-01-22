const util = require('node:util')
const rl = require('node:readline').createInterface({
	input: process.stdin,
	output: process.stdout
})
const question = util.promisify(rl.question).bind(rl)

module.exports = async function askQuestion(message) {
	let answer

	try {
		answer = await question(message)
	} catch (e) {
		console.error(e)
		process.exit(1)
	}

	return answer
}
