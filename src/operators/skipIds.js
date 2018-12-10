const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const skipIds = createOperator(createManuallyOperation('skipIds'))

module.exports = skipIds
