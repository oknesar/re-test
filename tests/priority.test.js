const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const retest = require('../index')
const uuid = require('uuid')
const { action, id, skipIds, skipTo, depends, skipAll, recovery } = retest.operators

chai.use(chaiAsPromised)

const assert = chai.assert

describe('Dependencies tests', () => {
  let suite, ctx
  beforeEach(() => {
    ctx = {}
    suite = retest(ctx)
  })

  describe('Simply', () => {
    it('skipTo', async () => {
      let suiteShouldBePassed = true
      let targetHaveWorked = false
      const targetId = uuid()

      const suiteFalsy = suite(action(() => assert.throw()), skipTo(targetId))
      const suitePassed = suite(action(() => (suiteShouldBePassed = false)))
      const suiteTarget = suite(id(targetId), action(() => (targetHaveWorked = true)))

      await assert.isRejected(suiteFalsy())
      await assert.isRejected(suitePassed())
      await suiteTarget()

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(targetHaveWorked)
    })

    it('skipIds (one)', async () => {
      let suiteShouldBePassed = true
      let targetHaveWorked = false
      const targetId = uuid()

      const suiteFalsy = suite(action(() => assert.throw()), skipIds(targetId))
      const suitePassed = suite(id(targetId), action(() => (suiteShouldBePassed = false)))
      const suiteTarget = suite(action(() => (targetHaveWorked = true)))

      await assert.isRejected(suiteFalsy())
      await assert.isRejected(suitePassed())
      await suiteTarget()

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(targetHaveWorked)
    })

    it('skipIds (two)', async () => {
      let suiteShouldBePassed = true
      let suiteShouldBePassed1 = true
      let targetHaveWorked = false
      const ids = [uuid(), uuid()]

      const suiteFalsy = suite(action(() => assert.throw()), skipIds(ids))
      const suitePassed = suite(id(ids.pop()), action(() => (suiteShouldBePassed = false)))
      const suiteTarget = suite(action(() => (targetHaveWorked = true)))
      const suitePassed_ = suite(id(ids.pop()), action(() => (suiteShouldBePassed1 = false)))

      await assert.isRejected(suiteFalsy())
      await assert.isRejected(suitePassed())
      await suiteTarget()
      await assert.isRejected(suitePassed_())

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(suiteShouldBePassed1)
      assert.isTrue(targetHaveWorked)
    })

    it('depends', async () => {
      let suiteShouldBePassed = true
      let targetHaveWorked = false
      const targetId = uuid()

      const suiteFalsy = suite(action(() => assert.throw()), id(targetId))
      const suitePassed = suite(action(() => (suiteShouldBePassed = false)), depends(targetId))
      const suiteTarget = suite(action(() => (targetHaveWorked = true)))

      await assert.isRejected(suiteFalsy())
      await assert.isRejected(suitePassed())
      await suiteTarget()

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(targetHaveWorked)
    })

    it('skipAll', async () => {
      let suiteShouldBePassed = true
      let suiteShouldBePassed_ = true

      const suiteFalsy = suite(action(() => assert.throw()), skipAll())
      const suitePassed = suite(action(() => (suiteShouldBePassed = false)))
      const suitePassed_ = suite(action(() => (suiteShouldBePassed_ = false)))

      await assert.isRejected(suiteFalsy())
      await assert.isRejected(suitePassed())
      await assert.isRejected(suitePassed_())

      assert.isTrue(suiteShouldBePassed)
      assert.isTrue(suiteShouldBePassed_)
    })

    it('recovery', async () => {
      let suiteShouldBePassed = true
      let suiteShouldBePassed_ = true
      let shouldBeFalse = false
      let shouldBeTrue = false

      const suiteFalsy = suite(action(() => assert.throw()), skipTo('last'))
      const suitePassed = suite(recovery(() => (shouldBeFalse = true)), action(() => (suiteShouldBePassed = false)))
      const suitePassed_ = suite(
        id('last'),
        recovery(() => (shouldBeTrue = true)),
        action(() => (suiteShouldBePassed_ = false)),
      )

      await assert.isRejected(suiteFalsy())
      await assert.isRejected(suitePassed())
      await assert.isFulfilled(suitePassed_())

      assert.isTrue(suiteShouldBePassed)
      assert.isFalse(suiteShouldBePassed_)
      assert.isFalse(shouldBeFalse)
      assert.isTrue(shouldBeTrue)
    })
  })
})
