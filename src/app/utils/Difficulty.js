module.exports = class Difficulty {
	constructor(level) {
		this.level = level
	}

	toString() {
		switch (this.level) {
			case '2':
				return 'normal'
			case '1':
				return 'easy'
			default:
				return 'default option easy'
		}
	}
}
