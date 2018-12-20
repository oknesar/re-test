const { SkipError } = require('./lib/errors')

class State {
  constructor() {
    this.skipIds = []
    this.failed = []
    this.skipTo = null
    this.skipAll = false
    this.errorBefore = false
  }

  saveFailedId(model) {
    if (model.id) this.failed.push(model.id)
  }

  saveSkippedIds(model) {
    if (model.skipIds && model.skipIds.length) this.skipIds.push(...model.skipIds)
  }

  saveSkipAll(model) {
    if (model.skipAll) this.skipAll = model.skipAll
  }

  saveSkipTo(model) {
    if (model.skipTo) this.skipTo = model.skipTo
  }

  checkSkipAll() {
    if (!this.skipAll) return

    throw new SkipError('All skipped')
  }

  checkSkipTo(model) {
    if (!this.skipTo) return
    if (model.id === this.skipTo) {
      this.skipTo = null
      return
    }

    this.throwSkipError(model, `Skipped because waiting for "${this.skipTo}"`)
  }

  checkSkipIds(model) {
    if (!model.id) return
    if (!this.skipIds.includes(model.id)) return

    this.throwSkipError(model, `Skipped by id "${model.id}"`)
  }

  checkDependency(model) {
    if (!model.depends || !model.depends.length) return
    const dependency = model.depends.find(id => this.failed.includes(id))
    if (dependency) {
      this.throwSkipError(model, `Skipped because "${dependency}" failed`)
    }
  }

  throwSkipError(model, message) {
    this.saveFailedId(model)
    this.saveSkippedIds(model)
    throw new SkipError(message)
  }
}

module.exports = State
