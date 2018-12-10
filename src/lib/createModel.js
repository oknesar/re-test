const { flatterOperators } = require('./helpers')

const createModel = operators =>
  flatterOperators(operators).reduce((acc, operator) => operator(acc), {
    recovery: [],
    action: [],
    rescue: [],
    otherwise: [],

    id: null,
    depends: [],
    skipIds: [],
    skipTo: null,
  })

module.exports = createModel
