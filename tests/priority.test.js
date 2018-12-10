const assert = require('chai').assert
const retest = require('../index')
const uuid = require('uuid')
const { body, id, skipIds, skipTo, depends } = retest.operators

describe('Dependencies tests', () => {
  let suite, ctx
  before(() => {
    ctx = {}
    suite = retest(ctx)
  })

  describe('Simply', () => {
    it('skipTo', async () => {
      let suiteShouldBePassed = true
      let targetHaveWorked = false
      const targetId = uuid()

      const suiteFalsy = suite(body(() => assert.throw()), skipTo(targetId))
      const suitePassed = suite(body(() => (suiteShouldBePassed = false)))
      const suiteTarget = suite(id(targetId), body(() => (targetHaveWorked = true)))

      await suiteFalsy().catch(() => {})
      await suitePassed().catch(() => {})
      await suiteTarget()

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(targetHaveWorked)
    })

    it('skipIds (one)', async () => {
      let suiteShouldBePassed = true
      let targetHaveWorked = false
      const targetId = uuid()

      const suiteFalsy = suite(body(() => assert.throw()), skipIds(targetId))
      const suitePassed = suite(id(targetId), body(() => (suiteShouldBePassed = false)))
      const suiteTarget = suite(body(() => (targetHaveWorked = true)))

      await suiteFalsy().catch(() => {})
      await suitePassed().catch(() => {})
      await suiteTarget()

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(targetHaveWorked)
    })

    it('skipIds (two)', async () => {
      let suiteShouldBePassed = true
      let suiteShouldBePassed1 = true
      let targetHaveWorked = false
      const ids = [uuid(), uuid()]

      const suiteFalsy = suite(body(() => assert.throw()), skipIds(ids))
      const suitePassed = suite(id(ids.pop()), body(() => (suiteShouldBePassed = false)))
      const suiteTarget = suite(body(() => (targetHaveWorked = true)))
      const suitePassed1 = suite(id(ids.pop()), body(() => (suiteShouldBePassed1 = false)))

      await suiteFalsy().catch(() => {})
      await suitePassed().catch(() => {})
      await suiteTarget()
      await suitePassed1().catch(() => {})

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(suiteShouldBePassed1)
      assert.isTrue(targetHaveWorked)
    })

    it('depends', async () => {
      let suiteShouldBePassed = true
      let targetHaveWorked = false
      const targetId = uuid()

      const suiteFalsy = suite(body(() => assert.throw()), id(targetId))
      const suitePassed = suite(body(() => (suiteShouldBePassed = false)), depends(targetId))
      const suiteTarget = suite(body(() => (targetHaveWorked = true)))

      await suiteFalsy().catch(() => {})
      await suitePassed().catch(() => {})
      await suiteTarget()

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(targetHaveWorked)
    })
  })
})
