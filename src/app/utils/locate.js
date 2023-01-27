module.exports = (roomNumber) => (elementToLocate) => {
	if (typeof elementToLocate?.getRoomNumber !== 'function') {
		throw new Error('Element to locate has no getter for room number')
	}

	if (null === elementToLocate.getRoomNumber()) {
		return false
	}

	return elementToLocate.roomNumber === roomNumber
}
