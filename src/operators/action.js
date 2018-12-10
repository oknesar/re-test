const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const body = createOperator(createManuallyOperation('action'))

module.exports = body
