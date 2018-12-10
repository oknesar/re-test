const createOperator = operation => value => entity => operation(entity, value)

module.exports = createOperator
