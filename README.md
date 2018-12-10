## Retest
#### Like recompose for end-to-end tests

split test logic

````$xslt
const retest = require('re-test')
const { action, rescue, othewise } = retest.operators

const context = {
    // ...some object than will be passed to each cycle callback
}

const suite = retest(context)

it('Open modal and check title', suite(
    action(async ctx => { // main test logic
        await ctx.openModal()
        await ctx.checkTitle()
    }),
    rescue(ctx => ctx.screenshot()), // if action failed
    othewise(ctx => ctx.closeModal()) // run anyway
))
````

save common chunks

````$xslt
const screenshot = rescue(ctx => ctx.screenshot())
const logError = rescue((ctx, err) => ctx.log(err))

it('Test', suite(
    action(/* ... */),
    screenshot,
    logError
))

const shotAndLog = suite(
    screenshot,
    logError
)

it('Test', suite(
    action(/* ... */),
    shotAndLog
))
````

define tests dependencies

````$xslt
const retest = require('re-test')
const { action, depends, id } = retest.operators

const context = {
    // ...some object than will be passed to each cycle callback
}

const suite = retest(context)

it('Open modal', suite(
    id('openModel'),
    action(async ctx => {
        await ctx.checkTitle()
    })
))

it('Check modal title', suite(
    depends(['openModel']),
    action(async ctx => { 
        await ctx.checkTitle()
    })
))
````

````$xslt
const retest = require('re-test')
const { action, skipTo, id } = retest.operators

const context = {
    // ...some object than will be passed to each cycle callback
}

const suite = retest(context)

it('Open modal', suite(
    action(async ctx => {
        await ctx.checkTitle()
    }),
    skipTo('someTest'),
))

// if 'Open modal' test will throw error, all tests above 
// 'Some new test' will be failed

it('Some new test', suite(
    id('someTest'),
    action(async ctx => { 
        // ...
    })
))
````


