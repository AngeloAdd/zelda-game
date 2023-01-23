const TextLoader = require('./TextLoader')

let textLoader
beforeEach(() => {
	textLoader = new TextLoader()
})

afterEach(() => {
	textLoader = null
})

describe('TextLoader', () => {
	test('can retrieve assets by key recursively', () => {
		expect(textLoader.getTextByKey('player.nameQuestion')).toEqual(
			'What is your name, brave warrior?'
		)
		expect(textLoader.getTextByKey('princess.reaction.medusa')).toEqual(
			'The princess turns to the ominous statue with snake-like hairs.'
		)
		expect(textLoader.getTextByKey('startingText'))
			.toEqual(`                                                Legend of Zelda: Kind Of

                                      ############################################
                                      #                                          #
                                      #                START GAME                #
                                      #                                          #
                                      ############################################

Brave adventurer, the princess of the kingdom of CPeria has been captured by an evil wizard and locked away in a castle
guarded by fierce monsters. Your mission, should you choose to accept it, is to set her free and bring her back safely
outside the castle. Are you ready to embark on this thrilling quest and save the princess?
`)
	})
	test('can retrieve assets by key and do substitutions', () => {
		expect(textLoader.getTextByKey('player.nameResponse', { playerName: 'Ciro' })).toEqual(
			'Welcome Ciro!'
		)
	})
})
