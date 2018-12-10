const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')
const { propSetter } = createManuallyOperation.setters

const skipTo = createOperator(createManuallyOperation('skipTo', propSetter))

module.exports = skipTo
