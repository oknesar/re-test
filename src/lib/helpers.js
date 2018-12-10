const sym = require('../symbols')

function flatterOperators(operators) {
  return operators
    .filter(Boolean)
    .reduce(
      (acc, operator) => acc.concat(operator[sym.operators] ? flatterOperators(operator[sym.operators]) : operator),
      [],
    )
}

async function pipe(functions, ctx, temp) {
  for (const fn of functions) {
    try {
      temp = await fn(ctx, temp)
    } catch (e) {
      e.temp = temp
      throw e
    }
  }
  return temp
}

module.exports = {
  flatterOperators,
  pipe,
}
