const fs = require('node:fs')
const path = require('node:path')
const importedText = require('../assets/text.json')

module.exports = class TextLoader {
	constructor() {
		this.texts = importedText
		this.loadGameTexts()
	}

	getTextByKey(key, substitution) {
		const keyRecursive = key.split('.')
		let textFromJson = this.texts
		for (let i = 0; i < keyRecursive.length; i++) {
			textFromJson = textFromJson[keyRecursive[i]]
			if (i === keyRecursive.length - 1) {
				break
			}
		}

		if (substitution && typeof substitution === 'object') {
			for (const sub in substitution) {
				textFromJson = textFromJson.replace(`##${sub}##`, substitution[sub])
			}
		}

		return textFromJson
	}

	loadGameTexts() {
		this.texts.startingText = this.readTxt('Start')
		this.texts.endDead = this.readTxt('EndDead')
		this.texts.endLose = this.readTxt('EndLose')
		this.texts.endWin = this.readTxt('EndWin')
		this.roomsText = this.readTxt('Rooms')
			.split('##ROOM##')
			.filter((el) => el)
			.map((el) => el.trim().split('\n'))
	}

	readTxt(filename) {
		return fs.readFileSync(path.join('src', 'assets', filename + '.txt')).toString()
	}

	getByEndCause(cause) {
		switch (cause) {
			case 'EndDead':
				return this.texts.endDead
			case 'EndWin':
				return this.texts.endWin
			case 'EndLose':
				return this.texts.endLose
			default:
				throw new Error('Unspecified End Cause')
		}
	}
}
