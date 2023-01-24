const Game = require('./Game')
const GameState = require('./GameState')
const RoomObject = require('./DTO/Object')
const config = require('../libs/Config')

let game
beforeEach(() => {
	game = new Game(new GameState(config))
})

afterEach(() => {
	game = null
})

describe('Game command methods modify state correctly or not when', () => {
	describe('move command', () => {
		test.each(['MOVE S', 'MOVE', 'MOVE ', 'MOVE NORTH'])('returns invalid message', (command) => {
			expect(game.parseUserCommand(command)).toEqual('Invalid direction!')
		})
		test('can make player between rooms', () => {
			expect(game.state.getCurrentRoom().roomNumber).toEqual(1)
			game.parseUserCommand('MOVE SOUTH')
			expect(game.state.getCurrentRoom().roomNumber).toEqual(4)
			game.parseUserCommand('MOVE NORTH')
			expect(game.state.getCurrentRoom().roomNumber).toEqual(1)
			game.parseUserCommand('MOVE NORTH')
			expect(game.state.getCurrentRoom().roomNumber).toEqual(1)
		})
		test('bounces player if room is protected by a monster', () => {
			;['MOVE EAST', 'MOVE SOUTH', 'MOVE SOUTH'].forEach((el) => game.parseUserCommand(el))
			expect(game.state.getCurrentRoom().roomNumber).toEqual(5)
		})
		test('makes app end if from room 1 player goes west and exits the castle', () => {
			game.parseUserCommand('MOVE WEST')
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('lose')
		})
	})

	describe('pick command', () => {
		test.each(['PICK', 'PICK '])('needs the name of an object as parameter', (command) => {
			expect(game.parseUserCommand(command)).toEqual('You should specify an object.')
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
		})
		test('allows player to pick nothing if room is empty', () => {
			const response = game.parseUserCommand('PICK GOLDEN CALICE')
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
			expect(response).toEqual('There is no such object in this room to pick up.')
		})
		test('allows player to pick one object', () => {
			game.parseUserCommand('MOVE SOUTH')
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(1)
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
			const response = game.parseUserCommand('PICK GOLDEN CALICE')
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(0)
			expect(game.state.getObjectsInPlayerBag().length).toEqual(1)
			expect(response).toEqual('You picked GOLDEN CALICE and put it in your bag.')
		})
		test('allows player pick multiple objects', () => {
			let response
			;['MOVE SOUTH', 'PICK GOLDEN CALICE', 'MOVE NORTH', 'MOVE EAST', 'PICK GOLDEN EGG'].forEach(
				(el) => {
					response = game.parseUserCommand(el)
				}
			)
			expect(game.state.getObjectsInPlayerBag().length).toEqual(2)
			expect(response).toEqual('You picked GOLDEN EGG and put it in your bag.')
		})
		test('max three objects', () => {
			game.state.objects.objects.push(new RoomObject('BELL BELL', null, 500000))
			game.state.objects.objects.push(new RoomObject('CIAO BELL', null, 500000))
			game.state.objects.objects.push(new RoomObject('ARRIVERDERCI BELL', null, 500000))
			game.state.objects.objects.push(new RoomObject('ULTIMO BELL', 1, 500000))
			expect(game.parseUserCommand('PICK ULTIMO BELL')).toEqual(
				'Your bag is full you cannot pick up other objects.'
			)
			expect(game.state.getObjectsInPlayerBag().length).toEqual(3)
		})
	})
	describe('drop command', () => {
		test.each(['DROP', 'DROP '])('needs the name of an object as parameter', (command) => {
			expect(game.parseUserCommand(command)).toEqual('You should specify an object.')
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
		})
		test('allows player to drop nothing if player bags is empty', () => {
			expect(game.parseUserCommand('DROP GOLDEN CALICE')).toEqual(
				'There is no such object in your bag.'
			)
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(0)
		})
		test('allows player to drop one object', () => {
			game.state.objects.objects.push(new RoomObject('BELL BELL', null, 500000))
			expect(game.parseUserCommand('DROP BELL BELL')).toEqual(
				'You dropped BELL BELL in room number 1'
			)
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(1)
		})
		test('allows player drop multiple objects', () => {
			;[
				'MOVE SOUTH',
				'PICK GOLDEN CALICE',
				'MOVE NORTH',
				'MOVE EAST',
				'PICK GOLDEN EGG',
				'DROP GOLDEN CALICE',
				'DROP GOLDEN EGG'
			].forEach((el) => {
				game.parseUserCommand(el)
			})
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
		})
		test('does not let player to drop object in full room', () => {
			game.state.objects.objects.forEach((el) => (el.room = 1))
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(5)
			game.state.objects.objects.push(new RoomObject('BELL BELL', null, 500000))
			expect(game.state.getObjectsInPlayerBag().length).toEqual(1)
			expect(game.parseUserCommand('DROP BELL BELL')).toEqual(
				'The room is full, you can not drop any object'
			)
			expect(game.state.getObjectsInPlayerBag().length).toEqual(1)
		})
	})

	describe('attack command', () => {
		test.each([
			[
				'Medusa',
				5,
				'MIRROR SHIELD',
				"Medusa's eyes widen in horror as she realizes that her curse has now been turned against her."
			],
			[
				'Dracula',
				6,
				'SILVER SWORD',
				'The powerful vampire exudes an eerie silence as his body slowly disintegrates into dust.'
			]
		])('kills %s in room %i with %s', (monsterName, roomNumber, objectName, defeatMessage) => {
			game.state.setCurrentRoomByNumber(roomNumber)
			game.state.objects.objects.forEach((el) => (el.name === objectName ? (el.room = null) : null))

			expect(game.parseUserCommand('ATTACK')).toEqual(defeatMessage)
			expect(game.state.monsters.monsters.filter((el) => el.name === monsterName)[0].alive).toBe(
				false
			)
		})
		test.each([
			[5, "Medusa's gaze turns you to stone as you foolishly attack her."],
			[6, 'Dracula drains you of your blood while you helplessly struggle to hurt him.']
		])('causes player death if right weapon is not in player bag', (roomNumber, ending) => {
			game.state.setCurrentRoomByNumber(roomNumber)
			expect(game.parseUserCommand('ATTACK')).toEqual(ending)
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('dead')
		})
		test('does nothing if player is not in front of a monster', () => {
			expect(game.parseUserCommand('ATTACK')).toEqual(
				'You start moving your arms in the air. Are you ok?'
			)
		})
	})
	describe('look command', () => {
		test('does nothing', () => {
			expect(game.parseUserCommand('LOOK')).toEqual(
				"You cautiously scan the room, feeling as if the room's eerie presence is staring at you in return."
			)
		})
	})
	describe('exit command', () => {
		test('exits app with win if in room 9', () => {
			game.state.setCurrentRoomByNumber(9)
			expect(game.parseUserCommand('EXIT')).toEqual(
				'The princess beams with joy as she follows you, eager to put her horrible experience behind her.'
			)
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('win')
		})
		test('exits app with app over if not in room 9', () => {
			expect(game.parseUserCommand('EXIT')).toEqual('Exiting the castle...')
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('lose')
		})
	})
})
