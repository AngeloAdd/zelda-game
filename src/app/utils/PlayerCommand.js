const BASE_COMMANDS = ['move', 'look', 'attack', 'drop', 'pick', 'exit']

module.exports = class PlayerCommand {
	constructor(command) {
		let escaped = command.toLowerCase().trim()
		this.baseCommand = BASE_COMMANDS.filter((el) => escaped.split(' ').filter((com) => com === el)[0])[0]
		this.param = this._getParam(escaped)
	}

	command() {
		return this.baseCommand
	}

	parameter() {
		return this.param
	}

	_getParam(command) {
		const param = command
			.split(' ')
			.filter((el) => !el.includes(this.baseCommand))
			.join(' ')
			.trim()
		return param.includes(this.baseCommand) ? null : param
	}
}
