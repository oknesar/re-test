const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')
const { constantSetter } = createManuallyOperation.setters

const skipAll = createOperator(createManuallyOperation('skipAll', constantSetter(true)))

module.exports = skipAll
