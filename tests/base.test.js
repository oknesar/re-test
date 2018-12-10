const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const retest = require('../index')
const { action, rescue, recovery, otherwise } = retest.operators

chai.use(chaiAsPromised)

const assert = chai.assert

describe('Base tests', () => {
  let suite, ctx
  before(() => {
    ctx = {}
    suite = retest(ctx)
  })

  it('Check context', async () => {
    const test = suite(
      action(async context => {
        assert.equal(context, ctx)
        throw new Error()
      }),
      rescue(async context => assert.equal(context, ctx)),
      otherwise(async context => assert.equal(context, ctx)),
    )
    assert.instanceOf(test, Function)
    await assert.isRejected(test())
  })

  it('Check action chain', async () => {
    const counter = Array(10).fill(false)
    const test = suite(...makeChainOfOperators(counter, action))
    await test()
    counter.forEach(assert.isTrue)
  })

  it('Check rescue chain', async () => {
    const counter = Array(10).fill(false)
    const test = suite(
      action(async () => {
        throw new Error()
      }),
      ...makeChainOfOperators(counter, rescue),
    )
    await assert.isRejected(test())
    counter.forEach(assert.isTrue)
  })

  it('Check recovery chain', async () => {
    const counter = Array(10).fill(false)
    const testWithError = suite(
      action(() => {
        throw new Error()
      }),
    )
    const test = suite(...makeChainOfOperators(counter, recovery))
    await assert.isRejected(testWithError())
    await assert.isFulfilled(test())
    counter.forEach(assert.isTrue)
  })

  it('Check otherwise chain (no errors)', async () => {
    const counter = Array(10).fill(false)
    const test = suite(action(async () => {}), ...makeChainOfOperators(counter, otherwise))
    await assert.isFulfilled(test())
    counter.slice(1).forEach(assert.isTrue)
  })

  it('Check otherwise chain (with errors)', async () => {
    const counter = Array(10).fill(false)
    const test = suite(
      action(async () => {
        throw new Error()
      }),
      ...makeChainOfOperators(counter, otherwise),
    )
    await assert.isRejected(test())
    counter.slice(1).forEach(assert.isTrue)
  })

  it('Check action nested chain', async () => {
    const counter = Array(10).fill(false)
    const test = createTest()
    await test()
    counter.forEach(assert.isTrue)

    function createTest(n = 0) {
      return suite(
        action(async () => {
          counter[n] = true
        }),
        n < 10 && createTest(n + 1),
      )
    }
  })
})

function makeChainOfOperators(counter, operator) {
  return counter.map((_, i) =>
    operator(async () => {
      counter[i] = true
    }),
  )
}
