const createOperator = require('../lib/createOperator')
const createManuallyOperation = require('../lib/createManuallyOperation')
const { propSetter } = createManuallyOperation.setters

const id = createOperator(createManuallyOperation('id', propSetter))

module.exports = id
