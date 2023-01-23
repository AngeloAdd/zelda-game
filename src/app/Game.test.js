const TextLoader = require('../libs/TextLoader')
const Game = require('./Game')
const GameState = require('./GameState')
const Object = require('./DTO/Object')
const Room = require('./DTO/Room')

let stateMachine
beforeEach(() => {
	stateMachine = new Game(new GameState(new TextLoader().texts.rooms))
})

afterEach(() => {
	stateMachine = null
})

describe('Game command methods modify state correctly or not when', () => {
	describe('move command', () => {
		test.each(['MOVE S', 'MOVE', 'MOVE ', 'MOVE NORTH'])('returns invalid message', (command) => {
			expect(stateMachine.parseUserCommand(command)).toEqual('Invalid direction!')
		})
		test('can make player between rooms', () => {
			expect(stateMachine.state.currentRoom.roomNumber).toEqual(1)
			stateMachine.parseUserCommand('MOVE SOUTH')
			expect(stateMachine.state.currentRoom.roomNumber).toEqual(4)
			stateMachine.parseUserCommand('MOVE NORTH')
			expect(stateMachine.state.currentRoom.roomNumber).toEqual(1)
			stateMachine.parseUserCommand('MOVE NORTH')
			expect(stateMachine.state.currentRoom.roomNumber).toEqual(1)
		})
		test('bounces player if room is protected by a monster', () => {
			;['MOVE EAST', 'MOVE SOUTH', 'MOVE SOUTH'].forEach((el) => stateMachine.parseUserCommand(el))
			expect(stateMachine.state.currentRoom.roomNumber).toEqual(5)
		})
		test('makes app end if from room 1 player goes west and exits the castle', () => {
			stateMachine.parseUserCommand('MOVE WEST')
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endingReason).toEqual('lose')
		})
	})

	describe('pick command', () => {
		test.each(['PICK', 'PICK '])('needs the name of an object as parameter', (command) => {
			expect(stateMachine.parseUserCommand(command)).toEqual('You should specify an object.')
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
		})
		test('allows player to pick nothing if room is empty', () => {
			const response = stateMachine.parseUserCommand('PICK GOLDEN CALICE')
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
			expect(response).toEqual('There is no such object in this room to pick up.')
		})
		test('allows player to pick one object', () => {
			stateMachine.parseUserCommand('MOVE SOUTH')
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(1)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
			const response = stateMachine.parseUserCommand('PICK GOLDEN CALICE')
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(0)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(1)
			expect(response).toEqual('You picked GOLDEN CALICE and put it in your bag.')
		})
		test('allows player pick multiple objects', () => {
			let response
			;['MOVE SOUTH', 'PICK GOLDEN CALICE', 'MOVE NORTH', 'MOVE EAST', 'PICK GOLDEN EGG'].forEach(
				(el) => {
					response = stateMachine.parseUserCommand(el)
				}
			)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(2)
			expect(response).toEqual('You picked GOLDEN EGG and put it in your bag.')
		})
		test('max three objects', () => {
			stateMachine.state.objects.push(new Object('BELL BELL', null, 500000))
			stateMachine.state.objects.push(new Object('CIAO BELL', null, 500000))
			stateMachine.state.objects.push(new Object('ARRIVERDERCI BELL', null, 500000))
			stateMachine.state.objects.push(new Object('ULTIMO BELL', 1, 500000))
			expect(stateMachine.parseUserCommand('PICK ULTIMO BELL')).toEqual(
				'Your bag is full you cannot pick up other objects.'
			)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(3)
		})
	})
	describe('drop command', () => {
		test.each(['DROP', 'DROP '])('needs the name of an object as parameter', (command) => {
			expect(stateMachine.parseUserCommand(command)).toEqual('You should specify an object.')
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
		})
		test('allows player to drop nothing if player bags is empty', () => {
			expect(stateMachine.parseUserCommand('DROP GOLDEN CALICE')).toEqual(
				'There is no such object in your bag.'
			)
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(0)
		})
		test('allows player to drop one object', () => {
			stateMachine.state.objects.push(new Object('BELL BELL', null, 500000))
			expect(stateMachine.parseUserCommand('DROP BELL BELL')).toEqual(
				'You dropped BELL BELL in room number 1'
			)
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(1)
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
				stateMachine.parseUserCommand(el)
			})
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
		})
		test('does not let player to drop object in full room', () => {
			stateMachine.state.objects.forEach((el) => (el.room = 1))
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(5)
			stateMachine.state.objects.push(new Object('BELL BELL', null, 500000))
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(1)
			expect(stateMachine.parseUserCommand('DROP BELL BELL')).toEqual(
				'The room is full, you can not drop any object'
			)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(1)
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
			stateMachine.state.currentRoom = new Room(
				roomNumber,
				stateMachine.state.roomsList[`${roomNumber}`].exits
			)
			stateMachine.state.objects.forEach((el) => (el.name === objectName ? (el.room = null) : null))

			expect(stateMachine.parseUserCommand('ATTACK')).toEqual(defeatMessage)
			expect(stateMachine.state.monsters.filter((el) => el.name === monsterName)[0].alive).toBe(
				false
			)
		})
		test.each([
			[5, "Medusa's gaze turns you to stone as you foolishly attack her."],
			[6, 'Dracula drains you of your blood while you helplessly struggle to hurt him.']
		])('causes player death if right weapon is not in player bag', (roomNumber, ending) => {
			stateMachine.state.currentRoom = new Room(
				roomNumber,
				stateMachine.state.roomsList[`${roomNumber}`].exits
			)
			expect(stateMachine.parseUserCommand('ATTACK')).toEqual(ending)
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endingReason).toEqual('dead')
		})
		test('does nothing if player is not in front of a monster', () => {
			expect(stateMachine.parseUserCommand('ATTACK')).toEqual(
				'You start moving your arms in the air. Are you ok?'
			)
		})
	})
	describe('look command', () => {
		test('does nothing', () => {
			expect(stateMachine.parseUserCommand('LOOK')).toEqual(
				"You cautiously scan the room, feeling as if the room's eerie presence is staring at you in return."
			)
		})
	})
	describe('exit command', () => {
		test('exits app with win if in room 9', () => {
			stateMachine.state.currentRoom = new Room(
				9,
				stateMachine.state.roomsList[`${9}`].exits
			)
			expect(stateMachine.parseUserCommand('EXIT')).toEqual(
				'The princess beams with joy as she follows you, eager to put her horrible experience behind her.'
			)
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endingReason).toEqual('win')
		})
		test('exits app with app over if not in room 9', () => {
			expect(stateMachine.parseUserCommand('EXIT')).toEqual('Exiting the castle...')
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endingReason).toEqual('lose')
		})
	})
})
