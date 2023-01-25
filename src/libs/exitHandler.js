const Logger = require('./Logger')

module.exports = function exitHandler(code, cause){
  const logger = new Logger()
  return function(error){
    logger.printNewLine()
    if(code === 1){
      logger.printWithColors(cause+': ', 'black', 'red', 'bright')
      logger.printWithColors(error, 'black', 'red', 'bright')
    }else{
      logger.printWithColors(cause, 'magenta', '', 'bright')
    }
    process.exit(code)
  }
}
