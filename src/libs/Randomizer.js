module.exports = class Randomizer {
	betweenMinAndMax(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
}
