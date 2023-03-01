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
}

export type ItemDragEvent = {
  [key in 'moved' | 'added' | 'removed']?: { element?: Item, newIndex?: number, oldIndex?: number }
}