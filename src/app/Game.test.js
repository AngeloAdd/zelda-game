const Game = require('./Game')
const RoomObject = require('./Entity/Object')
const PlayerCommand = require('./utils/PlayerCommand')
const GameStateFactory = require('../libs/GameStateFactory')
const Coordinates = require('./utils/Coordinates')
const config = require('../libs/config')

let game
beforeEach(() => {
	game = new Game(new GameStateFactory(config))
	game.initializeState('easy')
})

afterEach(() => {
	game = null
})

describe('Game command methods modify state correctly or not when', () => {
	describe('move command', () => {
		test.each(['MOVE S', 'MOVE NORTH'])('returns invalid message', (command) => {
			expect(game.parseUserCommand(new PlayerCommand(command))).toEqual(['commands.move.invalid'])
		})
		test.each(['MOVE', 'MOVE '])('returns required parameter message', (command) => {
			expect(game.parseUserCommand(new PlayerCommand(command))).toEqual(['commands.move.required'])
		})
		test('can make player between rooms', () => {
			expect(game.state.getCurrentRoom().roomCoordinates).toEqual(new Coordinates(0, 0))
			game.parseUserCommand(new PlayerCommand('MOVE SOUTH'))
			expect(game.state.getCurrentRoom().roomCoordinates).toEqual(new Coordinates(1, 0))
			game.parseUserCommand(new PlayerCommand('MOVE NORTH'))
			expect(game.state.getCurrentRoom().roomCoordinates).toEqual(new Coordinates(0, 0))
			game.parseUserCommand(new PlayerCommand('MOVE NORTH'))
			expect(game.state.getCurrentRoom().roomCoordinates).toEqual(new Coordinates(0, 0))
		})
		test('bounces player if room is protected by a monster', () => {
			;['MOVE EAST', 'MOVE SOUTH', 'MOVE SOUTH'].forEach((el) => game.parseUserCommand(new PlayerCommand(el)))
			expect(game.state.getCurrentRoom().roomCoordinates).toEqual(new Coordinates(1, 1))
		})
		test('makes app end if from room 1 player goes west and exits the castle', () => {
			game.parseUserCommand(new PlayerCommand('MOVE WEST'))
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('lose')
		})
	})

	describe('pick command', () => {
		test.each(['PICK', 'PICK '])('needs the name of an object as parameter', (command) => {
			expect(game.parseUserCommand(new PlayerCommand(command))).toEqual(['commands.pick.param'])
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
		})
		test('allows player to pick nothing if room is empty', () => {
			const response = game.parseUserCommand(new PlayerCommand('PICK GOLDEN CALICE'))
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
			expect(response).toEqual(['commands.pick.miss'])
		})
		test('allows player to pick one object', () => {
			game.parseUserCommand(new PlayerCommand('MOVE SOUTH'))
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(1)
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
			const response = game.parseUserCommand(new PlayerCommand('PICK GOLDEN CALICE'))
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(0)
			expect(game.state.getObjectsInPlayerBag().length).toEqual(1)
			expect(response).toEqual(['commands.pick.success', { objectName: 'GOLDEN CALICE' }])
		})
		test('allows player pick multiple objects', () => {
			let response
			;['MOVE SOUTH', 'PICK GOLDEN CALICE', 'MOVE NORTH', 'MOVE EAST', 'PICK GOLDEN EGG'].forEach((el) => {
				response = game.parseUserCommand(new PlayerCommand(el))
			})
			expect(game.state.getObjectsInPlayerBag().length).toEqual(2)
			expect(response).toEqual(['commands.pick.success', { objectName: 'GOLDEN EGG' }])
		})
		test('max three objects', () => {
			game.state.objects.objects.push(new RoomObject('BELL BELL', null, 500000))
			game.state.objects.objects.push(new RoomObject('CIAO BELL', null, 500000))
			game.state.objects.objects.push(new RoomObject('ARRIVERDERCI BELL', null, 500000))
			game.state.objects.objects.push(new RoomObject('ULTIMO BELL', new Coordinates(0, 0), 500000))
			expect(game.parseUserCommand(new PlayerCommand('PICK ULTIMO BELL'))).toEqual(['commands.pick.full'])
			expect(game.state.getObjectsInPlayerBag().length).toEqual(3)
		})
	})
	describe('drop command', () => {
		test.each(['DROP', 'DROP '])('needs the name of an object as parameter', (command) => {
			expect(game.parseUserCommand(new PlayerCommand(command))).toEqual(['commands.drop.param'])
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
		})
		test('allows player to drop nothing if player bags is empty', () => {
			expect(game.parseUserCommand(new PlayerCommand('DROP GOLDEN CALICE'))).toEqual(['commands.drop.miss'])
			expect(game.state.getObjectsInCurrentRoom().length).toEqual(0)
		})
		test('allows player to drop one object', () => {
			game.state.objects.objects.push(new RoomObject('BELL BELL', null, 500000))
			expect(game.parseUserCommand(new PlayerCommand('DROP BELL BELL'))).toEqual([
				'commands.drop.success',
				{ objectName: 'BELL BELL' }
			])
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
				game.parseUserCommand(new PlayerCommand(el))
			})
			expect(game.state.getObjectsInPlayerBag().length).toEqual(0)
		})
		test('does not let player to drop object in full room', () => {
			game.state.objects.objects.forEach((el, i) => {
				if (i < 4) {
					el.roomCoordinates = new Coordinates(0, 0)
				}
			})
			expect(game.state.isRoomFull()).toEqual(true)
			game.state.objects.objects.push(new RoomObject('BELL BELL', null, 500000))
			expect(game.state.getObjectsInPlayerBag().length).toEqual(1)
			expect(game.parseUserCommand(new PlayerCommand('DROP BELL BELL'))).toEqual(['commands.drop.full'])
			expect(game.state.getObjectsInPlayerBag().length).toEqual(1)
		})
	})

	describe('attack command', () => {
		test.each([
			['medusa', [1, 1], 'MIRROR SHIELD'],
			['dracula', [1, 2], 'SILVER DAGGER']
		])('kills %s in room %i with %s', (monsterName, roomCoordinates, objectName) => {
			game.state.setCurrentRoomByNumber(new Coordinates(...roomCoordinates))
			game.state.objects.objects.forEach((el) => (el.name === objectName ? (el.roomCoordinates = null) : null))

			expect(game.parseUserCommand(new PlayerCommand('ATTACK'))).toEqual([
				'commands.attack.success.' + monsterName.toLowerCase()
			])
			expect(game.state.monsters.monsters.filter((el) => el.name === monsterName)[0].alive).toBe(false)
		})
		test.each([
			[[1, 1], 'medusa'],
			[[1, 2], 'dracula']
		])('causes player death if right weapon is not in player bag', (roomCoordinates, ending) => {
			game.state.setCurrentRoomByNumber(new Coordinates(...roomCoordinates))
			expect(game.parseUserCommand(new PlayerCommand('ATTACK'))).toEqual(['commands.attack.defeat.' + ending])
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('dead')
		})
		test('does nothing if player is not in front of a monster', () => {
			expect(game.parseUserCommand(new PlayerCommand('ATTACK'))).toEqual(['commands.attack.null'])
		})
	})
	describe('look command', () => {
		test('does nothing', () => {
			expect(game.parseUserCommand(new PlayerCommand('LOOK'))).toEqual(['commands.look'])
		})
	})
	describe('exit command', () => {
		test('exits app with win if in room 9', () => {
			game.state.setCurrentRoomByNumber(new Coordinates(2, 2))
			expect(game.parseUserCommand(new PlayerCommand('EXIT'))).toEqual(['commands.exit.win'])
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('win')
		})
		test('exits app with app over if not in room 9', () => {
			expect(game.parseUserCommand(new PlayerCommand('EXIT'))).toEqual(['commands.exit.lose'])
			expect(game.state.isRunning).toEqual(false)
			expect(game.state.endingReason).toEqual('lose')
		})
	})
})
