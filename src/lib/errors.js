const util = require('util')

function SkipError(message, extra) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = message
  this.extra = extra
}

util.inherits(SkipError, Error)

module.exports = {
  SkipError,
}
