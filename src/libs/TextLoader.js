const fs = require('node:fs')
const path = require('node:path')
const importedText = require('../assets/text.json')

module.exports = class TextLoader {
	constructor() {
		this._loadGameTexts()
	}

	getTextByKey(key, substitution) {
		const keyRecursive = key.split('.')
		let textFromJson = this.texts

		try {
			for (let i = 0; i < keyRecursive.length; i++) {
				textFromJson = textFromJson[keyRecursive[i]]
				if(!textFromJson){
					throw new Error('undefined key: ' + key)
				}
				if (i === keyRecursive.length - 1) {
					break
				}
			}
		} catch (e) {
			console.log(e)
			textFromJson = 'placeholder could not retrieve for: ' + e
		}

		if (substitution && typeof substitution === 'object') {
			for (const sub in substitution) {
				textFromJson = textFromJson.replace(`##${sub}##`, substitution[sub])
			}
		}

		return textFromJson
	}

	_loadGameTexts() {
		this.texts = importedText
		this.texts.startingText = this._readTxt('Start')
		this.texts.dead = this._readTxt('EndDead')
		this.texts.lose = this._readTxt('EndLose')
		this.texts.win = this._readTxt('EndWin')

		this.texts.rooms = []
		this._readTxt('Rooms')
			.split('\n')
			.filter((el) => el !== '')
			.map((el) => this.texts.rooms.push(el.trim()))
	}

	_readTxt(filename) {
		return fs.readFileSync(path.join('src', 'assets', filename + '.txt')).toString()
	}
}
