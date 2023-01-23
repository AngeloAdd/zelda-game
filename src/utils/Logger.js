const RESET_STYLE_AND_COLORS = '\x1b[0m'

const STYLE = {
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m'
}

const COLORS = {
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	gray: '\x1b[90m'
}

const BG = {
	black: '\x1b[40m',
	red: '\x1b[41m',
	green: '\x1b[42m',
	yellow: '\x1b[43m',
	blue: '\x1b[44m',
	magenta: '\x1b[45m',
	cyan: '\x1b[46m',
	white: '\x1b[47m',
	gray: '\x1b[100m'
}

module.exports = class Logger {
	constructor() {}

	printNewLine() {
		process.stdout.write('\n')
	}

	printWithColors(message, color, bg, style) {
		try {
			if (COLORS[color]) {
				message = COLORS[color] + message
			}

			if (BG[bg]) {
				message = BG[bg] + message
			}

			if (STYLE[style]) {
				message = STYLE[style] + message
			}

			console.log(message + RESET_STYLE_AND_COLORS)
		} catch (e) {
			console.error(e)
			process.exit(e?.code ?? 1)
		}
	}
}
