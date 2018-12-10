const sym = require('../symbols')

const createManuallyOperation = (name, setter = arraySetter) => {
  const operator = (entity, value) => ({
    ...entity,
    [name]: setter(entity[name], value),
  })
  operator[sym.operatorName] = name
  return operator
}

const arraySetter = (arr = [], val) => arr.concat(val)
const propSetter = (_, val) => val

createManuallyOperation.setters = {
  arraySetter,
  propSetter,
}

module.exports = createManuallyOperation
