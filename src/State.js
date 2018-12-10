class State {
  constructor() {
    this.skipIds = []
    this.failed = []
    this.skipTo = null
    this.errorBefore = false
  }

  saveFailedId(model) {
    if (model.id) this.failed.push(model.id)
  }

  saveSkippedIds(model) {
    if (model.skipIds && model.skipIds.length) this.skipIds.push(...model.skipIds)
  }

  saveSkipTo(model) {
    if (model.skipTo) this.skipTo = model.skipTo
  }

  checkSkipTo(model) {
    if (!this.skipTo) return
    if (model.id === this.skipTo) {
      this.skipTo = null
      return
    }

    this.throwSkipError(`Skipped because waiting for "${state.skipTo}"`)
  }

  checkSkipIds(model) {
    if (!model.id) return
    if (!this.skipIds.includes(model.id)) return

    this.throwSkipError(`Skipped by id "${model.id}"`)
  }

  checkDependency(model) {
    if (!model.depends || !model.depends.length) return
    const dependency = model.depends.find(id => this.failed.includes(id))
    if (dependency) {
      this.throwSkipError(`Skipped because "${dependency}" failed`)
    }
  }

  throwSkipError(model, message) {
    this.saveFailedId(model)
    this.saveSkippedIds(model)
    throw new Error(message)
  }
}

module.exports = State
