const fs = require('node:fs')
const path = require('node:path')
const importedText = require('../assets/text.json')

module.exports = class TextLoader {
	constructor() {
		this._loadGameTexts()
	}

	getTextByKey(key, substitution, preserveObject = false) {
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

		if (!preserveObject) {
			if (!(typeof textFromJson === 'string')) {
				throw new Error('No text available under this key')
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

		this.texts.rooms = {}
		this._readTxt('Rooms')
			.split('##ROOM##')
			.filter((el) => el !== '')
			.map((el, i) => {
				let text = el.trim().split('\n')

				this.texts.rooms[`${i + 1}`] = {
					description: text[0],
					exits: text[1]
				}
			})
	}

	_readTxt(filename) {
		return fs.readFileSync(path.join('src', 'assets', filename + '.txt')).toString()
	}
}
