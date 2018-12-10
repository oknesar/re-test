const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const body = createOperator(createManuallyOperation('body'))

module.exports = body
