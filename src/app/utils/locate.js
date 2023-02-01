module.exports = (roomCoordinates) => (elementToLocate) => {
	if (typeof elementToLocate?.getRoomCoordinates !== 'function') {
		throw new Error('Element to locate has no getter for room number')
	}

	//if roomCoordinates is null we want to check for elements with room number null
	if (null === elementToLocate.getRoomCoordinates()) {
		return null === roomCoordinates
	}

	return elementToLocate.roomCoordinates.equals(roomCoordinates?.row, roomCoordinates?.column)
}
