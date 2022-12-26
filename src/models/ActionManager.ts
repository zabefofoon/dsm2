import {Group} from "./Item"

export interface Action {
  readonly actionName: string

  do: (groups: Group[]) => void,

  undo: (groups: Group[]) => void,

  redo: (groups: Group[]) => void,
}

export class ActionManager {

  readonly actions: Action[] = []

  readonly undoneActions: Action[] = []

  constructor(private groups: Group[]) {
  }

  execute(action: Action): Action {
    action.do(this.groups)
    this.actions.push(action)
    this.emptyUndoneActions()
    return action;
  }

  executeUndo(): Action | undefined {
    const lastAction = this.actions.pop()
    if (lastAction) {
      lastAction.undo(this.groups)
      this.undoneActions.push(lastAction)
      return lastAction
    }
  }

  executeRedo(): Action | undefined {
    const lastUndoneAction = this.undoneActions.pop()
    if (lastUndoneAction) {
      lastUndoneAction.redo(this.groups)
      this.actions.push(lastUndoneAction)
      return lastUndoneAction
    }
  }

  emptyActions(): void {
    this.actions.splice(0, this.actions.length)
    this.emptyUndoneActions()
  }

  private emptyUndoneActions(): void {
    this.undoneActions.splice(0, this.undoneActions.length)
  }
}