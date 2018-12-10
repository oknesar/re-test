const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')

const rescue = createOperator(createManuallyOperation('rescue'))

module.exports = rescue
