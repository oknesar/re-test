## Retest
#### Like recompose for end-to-end tests

#####Examples:

Simply test:

````$xslt
const retest = require('@oknesar/re-test')
const { action, rescue, othewise } = retest.operators

const context = {
    // ...some object than will be passed to each cycle callback
}

// suite it's function combiner
// you can pass different chunks(operators) into a suite
// and you can merge different suites
const suite = retest(context)

it('Open modal and check title', suite(
    action(async ctx => { // main test logic
        await ctx.openModal()
        await ctx.checkTitle()
    }),
    rescue((ctx, error) => ctx.screenshot()), // if action failed
    othewise(ctx => ctx.closeModal()) // run anyway
))
````

You can save common chunks in variables and use later.
Between, you can combine different chunks thought suite.

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

You can describe dependencies between suits

````$xslt
const retest = require('@oknesar/re-test')
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
    // if the suite with id 'openModel' will be failed
    // suits that depents on it will be passed
    depends(['openModel']),
    action(async ctx => { 
        await ctx.checkTitle()
    })
))
````

````$xslt
const retest = require('@oknesar/re-test')
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

// if 'Open modal' test will be failed
// all tests above suite with id 'Some new test' will be failed

it('Some new test', suite(
    id('someTest'),
    action(async ctx => { 
        // ...
    })
))
````

####Operators
***
`action(Context => any)`

Suite body
***
`depends([string])`

suite IDs that the current depends on
***
`rescue((Context, Error) => any)`

run on action throw error
***
`id(string)`

define suite id
***
`otherwise(Context => any)`

run anyway on suite not skipped
***
`recovery(Context => any)`

run if suite before was failed
***
`skipIds([string])`

if suite will failed, will skip passed ids
***
`skipTo(string)`

if suite will failed, will skip all before passed id
***
`skipAll()`
***


