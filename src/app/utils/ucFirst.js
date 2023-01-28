module.exports = function ucFirst(string) {
	try {
		return string[0].toUpperCase() + string.slice(1)
	} catch (e) {
		console.log(string)
		console.log(e)
		return 'ehibubu'
	}
}
