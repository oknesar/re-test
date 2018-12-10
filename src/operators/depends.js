const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const depends = createOperator(createManuallyOperation('depends'))

module.exports = depends
