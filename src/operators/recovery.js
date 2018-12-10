const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const recovery = createOperator(createManuallyOperation('recovery'))

module.exports = recovery
