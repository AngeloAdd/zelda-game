const fs = require('node:fs')
const path = require('node:path')
const importedText = require('../text/text.json')

class TextLoader {
	constructor(texts) {
		this.texts = texts
		this.loadGameTexts()
	}

	getTextByKey(key, substitution) {
		let textFromJson = this.texts[key]

		if (substitution && typeof substitution === 'object') {
			for (const sub in substitution) {
				textFromJson = textFromJson.replace(`##${sub}##`, substitution[sub])
			}
		}

		return textFromJson
	}

	loadGameTexts() {
		this.texts['starting_text'] = this.readTxt('Start')
		this.texts['end_dead'] = this.readTxt('EndDead')
		this.texts['end_lose'] = this.readTxt('EndLose')
		this.texts['end_win'] = this.readTxt('EndWin')
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
				return this.texts['end_dead']
			case 'EndWin':
				return this.texts['end_win']
			case 'EndLose':
				return this.texts['end_lose']
			default:
				throw new Error('Unspecified End Cause')
		}
	}
}

module.exports = new TextLoader(importedText)
