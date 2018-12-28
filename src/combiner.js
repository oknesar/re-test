const sym = require('./symbols')
const State = require('./State')
const createModel = require('./lib/createModel')
const { skipCycle, recoveryCycle, actionCycle, rescueCycle, otherwiseCycle } = require('./lib/cycles')

function createCombiner(ctx) {
  const state = new State()
  combine.dispatcher = state.getDispatcher()
  return combine

  function combine(...operators) {
    const model = createModel(operators)

    const cycleBundle = async function() {
      let _err, _temp
      skipCycle(model, state, this)
      try {
        _temp = await actionCycle(model, ctx, await recoveryCycle(model, state, ctx))
      } catch (err) {
        _err = err
        _temp = await rescueCycle(model, state, ctx, err)
      } finally {
        await otherwiseCycle(model, ctx, _temp)
      }
      if (_err) throw _err
    }

    cycleBundle[sym.operators] = operators

    return cycleBundle
  }
}

module.exports = createCombiner
