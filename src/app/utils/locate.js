module.exports = (roomNumber) => (elementToLocate) => {
	if (typeof elementToLocate?.getRoomNumber !== 'function') {
		throw new Error('Element to locate has no getter for room number')
	}

	//if roomNumber is null we want to check for elements with room number null
	if (null === elementToLocate.getRoomNumber() && null !== roomNumber) {
		return false
	}

	return elementToLocate.roomNumber === roomNumber
}
