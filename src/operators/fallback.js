const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const fallback = createOperator(createManuallyOperation('fallback'))

module.exports = fallback
