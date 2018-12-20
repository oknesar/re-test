const combiner = require('./src/combiner')

const action = require('./src/operators/action')
const depends = require('./src/operators/depends')
const rescue = require('./src/operators/rescue')
const id = require('./src/operators/id')
const otherwise = require('./src/operators/otherwise')
const recovery = require('./src/operators/recovery')
const skipIds = require('./src/operators/skipIds')
const skipTo = require('./src/operators/skipTo')
const skipAll = require('./src/operators/skipAll')
const errors = require('./src/lib/errors')

module.exports = combiner
module.exports.operators = {
  action,
  depends,
  rescue,
  id,
  otherwise,
  recovery,
  skipIds,
  skipTo,
  skipAll,
  errors,
}
