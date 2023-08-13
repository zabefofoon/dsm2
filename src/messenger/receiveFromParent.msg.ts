import {Group} from "../models/Item"

export type ReceivedData = { groups: Group[] }
export type ReceivedDataType = 'injectGroups' | 'undefinedMessage'
export const receiveFromParentMsg = (event: MessageEvent): [ReceivedDataType, ReceivedData] => {
  const data: ReceivedData = event.data

  if (event.data.type === 'injectGroups')
    return ['injectGroups', data]

  return ['undefinedMessage', data]
}