import util from "../util/util"

export class Group {
  name = ""
  items: Item[] = []
}

export class Item {
  id: string
  html = ''
  css = ''
  name = ''
  description = ''

  constructor() {
    this.id = util.generateUniqueId()
  }

  setName(value: string): this {
    this.name = value
    return this
  }

  setDescription(value: string): this {
    this.description = value
    return this
  }

  setHtml(value: string): this {
    this.html = value
    return this
  }

  setCss(value: string): this {
    this.css = value
    return this
  }
}

export type ItemDragEvent = {
  [key in 'moved' | 'added' | 'removed']?: { element?: Item, newIndex?: number, oldIndex?: number }
}