export class Group {
  name = ""
  items: Item[] = []
}

export class Item {
  html = ''
  css = ''
  name = ''
  description = ''
}

export type ItemDragEvent = {
  [key in 'moved' | 'added' | 'removed']?: { element?: Item, newIndex?: number, oldIndex?: number }
}