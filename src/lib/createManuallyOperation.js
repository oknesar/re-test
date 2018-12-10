const createManuallyOperation = (name, setter = arraySetter) => (entity, value) => ({
  ...entity,
  [name]: setter(entity[name], value),
})

const arraySetter = (arr = [], val) => arr.concat(val)
const propSetter = (_, val) => val

createManuallyOperation.setters = {
  arraySetter,
  propSetter,
}

module.exports = createManuallyOperation
