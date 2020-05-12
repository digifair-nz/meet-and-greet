const errorCodes = require('./errorCodes')
const printError = arg => console.log(`\x1b[33m%s\x1b[0m`, arg)

const loggerErrorHandler = {
    handleError: function handleError(errorCode, res, error) {
        printError(errorCode)
        
        if(errorCode == errorCodes.notFoundError) {
            console.log(res.fetcherData)
            printError(this.collection.modelName)
        }
        else {
            console.log(error)
        }
    }
}

module.exports = {
    logger: loggerErrorHandler
}