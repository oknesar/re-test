const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const otherwise = createOperator(createManuallyOperation('otherwise'))

module.exports = otherwise
