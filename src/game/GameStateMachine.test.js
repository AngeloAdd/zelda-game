const textLoader = require('../utils/TextLoader')
const StateMachine = require('./GameStateMachine')
const GameState = require('./GameState')
const Object = require('./DTO/Object')
const Room = require('./DTO/Room')

let stateMachine
beforeEach(() => {
	stateMachine = new StateMachine(new GameState(textLoader), textLoader)
})

afterEach(() => {
	stateMachine = null
})

describe('StateMachine command methods modify state correctly or not when', () => {
	describe('move command', () => {
		test.each(['MOVE S', 'MOVE', 'MOVE ', 'MOVE NORTH'])('returns invalid message', (command) => {
			stateMachine.parseUserCommand(command)
			expect(stateMachine.state.getUserCommandReaction()).toEqual('Invalid direction!')
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
		test('makes game end if from room 1 player goes west and exits the castle', () => {
			stateMachine.parseUserCommand('MOVE WEST')
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endCause).toEqual('EndLose')
		})
	})

	describe('pick command', () => {
		test.each(['PICK', 'PICK '])('needs the name of an object as parameter', (command) => {
			stateMachine.parseUserCommand(command)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
			expect(stateMachine.state.getUserCommandReaction()).toEqual('You should specify an object.')
		})
		test('allows player to pick nothing if room is empty', () => {
			stateMachine.parseUserCommand('PICK GOLDEN CALICE')
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
			expect(stateMachine.state.getUserCommandReaction()).toEqual(
				'There is no such object in this room to pick up.'
			)
		})
		test('allows player to pick one object', () => {
			stateMachine.parseUserCommand('MOVE SOUTH')
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(1)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
			stateMachine.parseUserCommand('PICK GOLDEN CALICE')
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(0)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(1)
			expect(stateMachine.state.getUserCommandReaction()).toEqual(
				'You picked GOLDEN CALICE and put it in your bag.'
			)
		})
		test('allows player pick multiple objects', () => {
			;['MOVE SOUTH', 'PICK GOLDEN CALICE', 'MOVE NORTH', 'MOVE EAST', 'PICK GOLDEN EGG'].forEach(
				(el) => {
					stateMachine.parseUserCommand(el)
				}
			)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(2)
			expect(stateMachine.state.getUserCommandReaction()).toEqual(
				'You picked GOLDEN EGG and put it in your bag.'
			)
		})
		/*test('max three objects', () => {
			stateMachine.parseUserCommand('MOVE SOUTH')
			stateMachine.parseUserCommand('PICK GOLDEN CALICE')
			stateMachine.parseUserCommand('MOVE NORTH')
			stateMachine.parseUserCommand('MOVE EAST')
			stateMachine.parseUserCommand('PICK GOLDEN EGG')
			stateMachine.parseUserCommand('MOVE EAST')
			stateMachine.parseUserCommand('PICK MIRROR SHIELD')
			stateMachine.parseUserCommand('MOVE WEST')
			stateMachine.parseUserCommand('MOVE SOUTH')
			stateMachine.parseUserCommand('ATTACK')
			stateMachine.parseUserCommand('MOVE SOUTH')
			stateMachine.parseUserCommand('PICK DIRTY PROOF')
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(3)
			expect(stateMachine.state.getUserCommandReaction()).toEqual('Your bag is full you cannot pick up other objects.')
		})*/
	})
	describe('drop command', () => {
		test.each(['DROP', 'DROP '])('needs the name of an object as parameter', (command) => {
			stateMachine.parseUserCommand(command)
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(0)
			expect(stateMachine.state.getUserCommandReaction()).toEqual('You should specify an object.')
		})
		test('allows player to drop nothing if player bags is empty', () => {
			stateMachine.parseUserCommand('DROP GOLDEN CALICE')
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(0)
			expect(stateMachine.state.getUserCommandReaction()).toEqual(
				'There is no such object in your bag.'
			)
		})
		test('allows player to drop one object', () => {
			stateMachine.state.objects.push(new Object('BELL BELL', null, 500000))
			stateMachine.parseUserCommand('DROP BELL BELL')
			expect(stateMachine.state.getObjectsByRoom().length).toEqual(1)
			expect(stateMachine.state.getUserCommandReaction()).toEqual(
				'You dropped BELL BELL in room number 1'
			)
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
			stateMachine.parseUserCommand('DROP BELL BELL')
			expect(stateMachine.state.getPlayerBagStatus().length).toEqual(1)
			expect(stateMachine.state.getUserCommandReaction()).toEqual(
				'The room is full, you can not drop any object'
			)
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
				stateMachine.state.textLoader.roomsText[roomNumber - 1]
			)
			stateMachine.state.objects.forEach((el) => (el.name === objectName ? (el.room = null) : null))

			stateMachine.parseUserCommand('ATTACK')
			expect(stateMachine.state.monsters.filter((el) => el.name === monsterName)[0].alive).toBe(
				false
			)
			expect(stateMachine.state.userCommandReaction).toEqual(defeatMessage)
		})
		test.each([
			[5, 'Medusa'],
			[6, 'Dracula']
		])('causes player death if right weapon is not in player bag', (roomNumber, monsterName) => {
			stateMachine.state.currentRoom = new Room(
				roomNumber,
				stateMachine.state.textLoader.roomsText[4]
			)
			stateMachine.parseUserCommand('ATTACK')
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endCause).toEqual('EndDead' + monsterName)
		})
		test('does nothing if player is not in front of a monster', () => {
			stateMachine.parseUserCommand('ATTACK')
			expect(stateMachine.state.userCommandReaction).toEqual(
				'You start moving your arms in the air. Are you ok?'
			)
		})
	})
	describe('look command', () => {
		test('does nothing', () => {
			stateMachine.parseUserCommand('LOOK')
			expect(stateMachine.state.userCommandReaction).toEqual(
				"You cautiously scan the room, feeling as if the room's eerie presence is staring at you in return."
			)
		})
	})
	describe('exit command', () => {
		test('exits game with win if in room 9', () => {
			stateMachine.state.currentRoom = new Room(9, stateMachine.textLoader.roomsText[8])
			stateMachine.parseUserCommand('EXIT')
			expect(stateMachine.state.userCommandReaction).toEqual(
				'The princess beams with joy as she follows you, eager to put her horrible experience behind her.'
			)
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endCause).toEqual('EndWin')
		})
		test('exits game with game over if not in room 9', () => {
			stateMachine.parseUserCommand('EXIT')
			expect(stateMachine.state.userCommandReaction).toEqual('Exiting the castle...')
			expect(stateMachine.state.isGameRunning).toEqual(false)
			expect(stateMachine.state.endCause).toEqual('EndLose')
		})
	})
})
