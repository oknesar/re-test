const combiner = require('./src/combiner')

const body = require('./src/operators/body')
const depends = require('./src/operators/depends')
const fallback = require('./src/operators/fallback')
const id = require('./src/operators/id')
const otherwise = require('./src/operators/otherwise')
const recovery = require('./src/operators/recovery')
const skipIds = require('./src/operators/skipIds')
const skipTo = require('./src/operators/skipTo')

module.exports = combiner
module.exports.operators = {
  body,
  depends,
  fallback,
  id,
  otherwise,
  recovery,
  skipIds,
  skipTo,
}
