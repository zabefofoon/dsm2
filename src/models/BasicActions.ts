import {Action} from "./ActionManager"
import {Group, Item} from "./Item"

export class RemoveAction implements Action {
  readonly actionName = 'Remove'
  deletedItems?: Item[]
  deletedGroup?: Group

  constructor(private groupIndex: number, private rowIndex: number) {
  }

  do(groups: Group[]): void {
    this.deletedItems = groups[this.groupIndex].items.splice(this.rowIndex, 1)
    if (groups[this.groupIndex].items.length === 0)
      this.deletedGroup = groups.splice(this.groupIndex, 1)[0]
  }

  undo(groups: Group[]): void {
    if (this.deletedGroup) {
      groups.splice(this.groupIndex, 0, this.deletedGroup)
    }
    this.deletedItems?.forEach((item) => {
      groups[this.groupIndex].items.splice(this.rowIndex, 0, item)
    })
  }

  redo(groups: Group[]): void {
    this.do(groups)
  }

  static of(groupIndex: number, rowIndex: number): RemoveAction {
    return new RemoveAction(groupIndex, rowIndex)
  }
}

export class DragMovedAction implements Action {
  readonly actionName = 'DragMoved'

  constructor(private groupIndex: number,
              private newIndex: number,
              private oldIndex: number) {
  }

  do(groups: Group[]): void {
    const item = groups[this.groupIndex].items.splice((this.newIndex), 1)[0]
    groups[this.groupIndex].items.splice(Number(this.newIndex), 0, item)
  }

  undo(groups: Group[]): void {
    const item = groups[this.groupIndex].items.splice((this.newIndex), 1)[0]
    groups[this.groupIndex].items.splice(Number(this.oldIndex), 0, item)
  }

  redo(groups: Group[]): void {
    this.do(groups)
  }

  static of(groupIndex: number, rowIndex: number, oldIndex: number): DragMovedAction {
    return new DragMovedAction(groupIndex, rowIndex, oldIndex)
  }
}

export type DragData = {
  fromGroupIndex: number,
  fromItemIndex: number,
  toGroupIndex: number,
  toItemIndex: number
}

export class DragRemovedAction implements Action {
  readonly actionName = 'DragAdded'

  constructor(private dragData: DragData) {
  }

  do(groups: Group[]): void {
    const item = groups[this.dragData.toGroupIndex].items[this.dragData.toItemIndex]
    groups[this.dragData.toGroupIndex].items.splice(this.dragData.toItemIndex, 1, item)
  }

  undo(groups: Group[]): void {
    const item = groups[this.dragData.toGroupIndex].items[this.dragData.toItemIndex]
    groups[this.dragData.fromGroupIndex].items.splice(this.dragData.fromItemIndex, 1, item)
    groups[this.dragData.toGroupIndex].items.splice(this.dragData.toItemIndex, 1)
  }

  redo(groups: Group[]): void {
    const item = groups[this.dragData.fromGroupIndex].items[this.dragData.fromItemIndex]
    groups[this.dragData.toGroupIndex].items.splice(this.dragData.toItemIndex, 0, item)
    groups[this.dragData.fromGroupIndex].items.splice(this.dragData.fromItemIndex, 1)
  }

  static of(dragData: DragData): DragRemovedAction {
    return new DragRemovedAction(dragData)
  }
}

export class AddAction implements Action {
  readonly actionName = 'Add'

  constructor(private groupIndex: number) {
  }

  do(groups: Group[]): void {
    groups[this.groupIndex].items.push(new Item())
  }

  undo(groups: Group[]): void {
    groups[this.groupIndex].items.splice(groups[this.groupIndex].items.length - 1, 1)
  }

  redo(groups: Group[]): void {
    this.do(groups)
  }

  static of(groupIndex: number): AddAction {
    return new AddAction(groupIndex)
  }
}

export class AddGroupAction implements Action {
  readonly actionName = 'AddGroup'

  do(groups: Group[]): void {
    groups.push({name: '', items: [new Item()]})
  }

  undo(groups: Group[]): void {
    groups.splice(groups.length - 1, 1)
  }

  redo(groups: Group[]): void {
    this.do(groups)
  }

  static of(): AddGroupAction {
    return new AddGroupAction()
  }
}
