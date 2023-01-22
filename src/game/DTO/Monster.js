module.exports = class Monster {
	constructor(name, room, alive, weakness, defeat) {
		this.name = name
		this.room = room
		this.alive = alive
		this.weakness = weakness
		this.defeat = defeat
	}

	getText() {
		if (this.name === 'Medusa') {
			if (this.alive) {
				return 'Medusa, the terrifying monster with snakes for hair, guards a locked door, turning those who dare to look at her gaze to stone.'
			} else {
				return 'An ominous statue stand at the center of the room, with a hundred of snake eyes piercing your soul.'
			}
		} else {
			if (this.alive) {
				return 'Dracula, the immortal vampire, stands guard at a locked door, his piercing gaze daring anyone to try and enter.'
			} else {
				return 'A small pile of ash and dust lies on the floor, the remnants of a once powerful being.'
			}
		}
	}
}
