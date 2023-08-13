import {deepClone} from "../util/util"
import {Group} from "../models/Item"

export const postParentSave = (groups: Group[]) => window
    .parent
    .postMessage({
      type: 'saveGroups',
      groups: deepClone(groups)
    }, '*')

export const postParentGroupsMutation = (groups: Group[]) => window
    .parent
    .postMessage({
      type: 'groupsMutation',
      groups: deepClone(groups)
    }, '*')