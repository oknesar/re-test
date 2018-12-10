const assert = require('chai').assert
const retest = require('../index')
const { body, fallback, recovery, otherwise } = retest.operators

describe('Base tests', () => {
  let suite, ctx
  before(() => {
    ctx = {}
    suite = retest(ctx)
  })

  it('Check context', async () => {
    const test = suite(
      body(async context => {
        assert.equal(context, ctx)
        throw new Error()
      }),
      fallback(async context => assert.equal(context, ctx)),
      otherwise(async context => assert.equal(context, ctx)),
    )
    assert.instanceOf(test, Function)
    await test().catch(() => {})
  })

  it('Check body chain', async () => {
    const counter = Array(10).fill(false)
    const test = suite(
      ...counter.map((_, i) =>
        body(async () => {
          counter[i] = true
        }),
      ),
    )
    await test()
    counter.forEach(assert.isTrue)
  })

  it('Check fallback chain', async () => {
    const counter = Array(10).fill(false)
    const test = suite(
      body(async () => {
        throw new Error()
      }),
      ...counter.map((_, i) =>
        fallback(async () => {
          counter[i] = true
        }),
      ),
    )
    await test().catch(() => {})
    counter.forEach(assert.isTrue)
  })

  it('Check recovery chain', async () => {
    const counter = Array(10).fill(false)
    const testWithError = suite(
      body(() => {
        throw new Error()
      }),
    )
    const test = suite(
      ...counter.map((_, i) =>
        recovery(async () => {
          counter[i] = true
        }),
      ),
    )
    await testWithError().catch(() => {})
    await test().catch(() => {})
    counter.forEach(assert.isTrue)
  })

  it('Check otherwise chain (no errors)', async () => {
    const counter = Array(10).fill(false)
    const test = suite(
      body(async () => {}),
      ...counter.map((_, i) =>
        otherwise(async () => {
          counter[i] = true
        }),
      ),
    )
    await test().catch(() => {})
    counter.slice(1).forEach(assert.isTrue)
  })

  it('Check otherwise chain (with errors)', async () => {
    const counter = Array(10).fill(false)
    const test = suite(
      body(async () => {
        throw new Error()
      }),
      ...counter.map((_, i) =>
        otherwise(async () => {
          counter[i] = true
        }),
      ),
    )
    await test().catch(() => {})
    counter.slice(1).forEach(assert.isTrue)
  })

  it('Check body nested chain', async () => {
    const counter = Array(10).fill(false)
    const test = createTest()
    await test()
    counter.forEach(assert.isTrue)

    function createTest(n = 0) {
      return suite(
        body(async () => {
          counter[n] = true
        }),
        n < 10 && createTest(n + 1),
      )
    }
  })
})
