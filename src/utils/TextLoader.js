const fs = require('node:fs')
const path = require('node:path')

class TextLoader {
	constructor() {
		this.loadGameTexts()
	}

	loadGameTexts() {
		this.startText = this.readTxt('Start')
		this.endDeadMedusa = this.readTxt('EndDeadMedusa')
		this.endDeadDracula = this.readTxt('EndDeadDracula')
		this.endLose = this.readTxt('EndLose')
		this.endWin = this.readTxt('EndWin')
		this.roomsText = this.readTxt('Rooms')
			.split('##ROOM##')
			.filter((el) => el)
			.map((el) => el.trim().split('\n'))
	}

	readTxt(filename) {
		return fs.readFileSync(path.join('src', 'text', filename + '.txt')).toString()
	}

	getByEndCause(cause) {
		switch (cause) {
			case 'EndDeadMedusa':
				return this.endDeadMedusa
			case 'EndDeadDracula':
				return this.endDeadDracula
			case 'EndWin':
				return this.endWin
			case 'EndLose':
				return this.endLose
			default:
				throw new Error('Unspecified End Cause')
		}
	}
}

module.exports = new TextLoader()
