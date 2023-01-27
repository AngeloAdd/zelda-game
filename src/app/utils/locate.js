module.exports = (roomCoordinates) => (elementToLocate) => {
	if (typeof elementToLocate?.getroomCoordinates !== 'function') {
		throw new Error('Element to locate has no getter for room number')
	}

	//if roomCoordinates is null we want to check for elements with room number null
	if (null === elementToLocate.getroomCoordinates()) {
		return null === roomCoordinates
	}

	return elementToLocate.roomCoordinates.equals(roomCoordinates?.row, roomCoordinates?.column)
}
