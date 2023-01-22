const fs = require('node:fs')
const path = require('node:path')

class TextLoader {
	constructor() {
		this.loadGameTexts()
	}

	loadGameTexts() {
		this.startText = this.readTxt('Start')
		this.endDead = this.readTxt('EndDead')
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
			case 'EndDead':
				return this.endDead
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
