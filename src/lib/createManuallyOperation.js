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
const constantSetter = val => (_, __) => val

createManuallyOperation.setters = {
  arraySetter,
  propSetter,
  constantSetter,
}

module.exports = createManuallyOperation
