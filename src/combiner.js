const sym = require('./symbols')
const { flatterOperators, pipe } = require('./lib/helpers')

function createCombiner(ctx) {
  const state = {
    skipIds: [],
    failed: [],
    skipTo: null,
    errorBefore: false,
  }

  const saveFailedId = model => {
    if (model.id) state.failed = state.failed.concat(model.id)
  }
  const saveSkippedIds = model => {
    if (model.skipIds && model.skipIds.length) state.skipIds = state.skipIds.concat(model.skipIds)
  }
  const saveSkipTo = model => {
    if (model.skipTo) state.skipTo = model.skipTo
  }

  return function combine(...operators) {
    const model = flatterOperators(operators).reduce((acc, operator) => operator(acc), {
      recovery: [],
      body: [],
      fallback: [],
      otherwise: [],

      id: null,
      depends: [],
      skipIds: [],
      skipTo: null,
    })

    const test = async () => {
      let err, temp
      skipCycle()
      if (err) throw err
      try {
        await recoveryCycle()
        await bodyCycle()
      } catch (e) {
        await fallbackCycle(e)
      } finally {
        await otherwiseCycle()
      }
      if (err) throw err

      function skipCycle() {
        try {
          const passedBySkipTo = state.skipTo && model.id !== state.skipTo
          const passedById = model.id && state.skipIds.includes(model.id)
          const passedByDependency = model.depends.find(id => state.failed.includes(id))

          if (passedBySkipTo) {
            throw new Error(`Skipped because waiting for "${state.skipTo}"`)
          } else if (state.skipTo) {
            state.skipTo = null
          }
          if (passedById) {
            throw new Error(`Skipped by id "${model.id}"`)
          }
          if (passedByDependency) {
            throw new Error(`Skipped because "${dependency}" failed`)
          }
        } catch (e) {
          saveFailedId(model)
          saveSkippedIds(model)
          err = e
        }
      }

      async function recoveryCycle() {
        if (state.errorBefore) {
          temp = await pipe(
            model.recovery,
            ctx,
          )
          state.errorBefore = false
        }
      }

      async function bodyCycle() {
        temp = await pipe(
          model.body,
          ctx,
          temp,
        )
      }

      async function fallbackCycle(e) {
        state.errorBefore = true
        saveFailedId(model)
        saveSkippedIds(model)
        saveSkipTo(model)
        err = e

        temp = await pipe(
          model.fallback,
          ctx,
          e,
        )
      }

      async function otherwiseCycle() {
        await pipe(
          model.otherwise,
          ctx,
          temp,
        )
      }
    }

    test[sym.operators] = operators

    return test
  }
}

module.exports = createCombiner
