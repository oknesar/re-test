const { pipe } = require('./helpers')

function skipCycle(model, state) {
  state.checkSkipTo(model)
  state.checkSkipIds(model)
  state.checkDependency(model)
}

async function recoveryCycle(model, state, ctx, temp) {
  if (!state.errorBefore) return temp
  state.errorBefore = false
  return await pipe(
    model.recovery,
    ctx,
  )
}

async function actionCycle(model, ctx, temp) {
  return await pipe(
    model.action,
    ctx,
    temp,
  )
}

async function rescueCycle(model, state, ctx, error) {
  state.errorBefore = true
  state.saveFailedId(model)
  state.saveSkippedIds(model)
  state.saveSkipTo(model)
  return await pipe(
    model.rescue,
    ctx,
    error,
  )
}

async function otherwiseCycle(model, ctx, temp) {
  await pipe(
    model.otherwise,
    ctx,
    temp,
  )
}

module.exports = {
  skipCycle,
  recoveryCycle,
  actionCycle,
  rescueCycle,
  otherwiseCycle,
}
