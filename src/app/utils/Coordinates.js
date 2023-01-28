module.exports = class Coordinates {
	constructor(row, column) {
		this.row = row
		this.column = column
	}

	equals(row, col) {
		return this.row === row && this.column === col
	}

	to(direction) {
		let row = this.row
		let column = this.column

		switch (direction) {
			case 'north':
				--row
				break
			case 'east':
				++column
				break
			case 'south':
				++row
				break
			case 'west':
				--column
				break
			default:
				throw new Error('Invalid Direction!')
		}

		return new Coordinates(row, column)
	}
}
