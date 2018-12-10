## Retest
#### Like recompose for end-to-end tests

split test logic

````$xslt
const retest = require('retest')
const { body, fallback, othewise, id } = retest.operators

const context = {
    // ...some helpers
}

const suite = retest(context)

it('Open modal and check title', suite(
    body(async ctx => { // main test logic
        await ctx.openModal()
        await ctx.checkTitle()
    }),
    fallback(ctx => ctx.screenshot()), // if body failed
    othewise(ctx => ctx.closeModal()) // run anyway
))
````

save common chunks

````$xslt
const screenshot = fallback(ctx => ctx.screenshot())
const logError = fallback((ctx, err) => ctx.log(err))

it('Test', suite(
    body(/* ... */),
    screenshot,
    logError
))

const shotAndLog = suite(
    screenshot,
    logError
)

it('Test', suite(
    body(/* ... */),
    shotAndLog
))
````
