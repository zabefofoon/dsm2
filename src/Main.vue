<template>
  <div
    class="tw-p-3 tw-pt-0 tw-bg-gray-100 tw-h-fit tw-min-h-screen tw-overflow-hidden">
    <UiStyle>{{ createCss }}</UiStyle>
    <div
      class="tw-bg-gray-100 tw-py-3 tw-flex tw-gap-2 tw-sticky tw-top-0 tw-left-0 tw-z-10 tw-text-slate-500">
      <button
        class="tw-border tw-border-solid tw-border-slate-200 tw-shadow-lg tw-h-fit tw-p-2 tw-bg-white tw-rounded-full"
        :class="{ active: !isShowAllCodes }"
        @click="toggleAllCode(false)">
        <span class="tw-text-lg dsm-icon dsm-icon-widgets"></span>
      </button>
      <button
        class="tw-border tw-border-solid tw-border-slate-200 tw-shadow-lg tw-h-fit tw-p-2 tw-bg-white tw-rounded-full"
        :class="{ active: isShowAllCodes }"
        @click="toggleAllCode(!isShowAllCodes)">
        <span class="tw-text-lg dsm-icon dsm-icon-code"></span>
      </button>
      <button
        v-if="editMode"
        class="tw-border tw-border-solid tw-border-slate-200 tw-shadow-lg tw-h-fit tw-p-2 tw-bg-white tw-rounded-full"
        @click="postParentSave(deepClone(groups))">
        <span class="tw-text-lg dsm-icon dsm-icon-save"></span>
      </button>
    </div>
    <AllCodes
      v-if="isShowAllCodes"
      :groups="groups"
      :edit-mode="editMode" />
    <ListStyleThumbnail
      v-else
      :groups="groups"
      :edit-mode="editMode"
      @delete="deleteElement"
      @add="addElement"
      @add-group="addGroup"
      @drag="onDrag"
      @drag-groups="onDragGroups"
      @copy="copyElement"
      @change-group="onChangeGroup"
      @change-item="onChangeItem"
      @set-item="onSetItem" />
  </div>
  <ModalsContainer />
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { ModalsContainer } from 'vue-final-modal'
import AllCodes from './components/AllCodes.vue'
import ListStyleThumbnail from './components/ListStyleThumbnail.vue'
import UiStyle from './components/UiStyle.vue'
import {
  postParentGroupsMutation,
  postParentSave
} from './messenger/postToParent.msg'
import { ActionManager } from './models/ActionManager'
import { Group, Item, type ItemDragEvent } from './models/Item'

import 'vue-final-modal/style.css'
import { receiveFromParentMsg } from './messenger/receiveFromParent.msg'
import {
  AddAction,
  AddGroupAction,
  ChangeGroupName,
  ChangeItem,
  CopyAction,
  DragGroupsMovedAction,
  DragMovedAction,
  DragRemovedAction,
  RemoveAction,
  SetItem
} from './models/BasicActions'
import { generateCss } from './util/generateCss'
import {
  deepClone,
  generateUniqueId,
  type NonFunctionPropertyNames
} from './util/util'

const editMode = computed(() => location.search.includes('edit=true'))

const isShowAllCodes = ref(false)
const toggleAllCode = (value: boolean) => (isShowAllCodes.value = value)

const createCss = computed(() => generateCss(groups.value))

const groups = ref<Group[]>([])
const setGroups = (_groups: Group[]) => {
  groups.value = _groups.map(group => {
    group.items = group.items.map(item => {
      if (!item.id) item.id = generateUniqueId()
      return item
    })
    return group
  })
  actionManager.value.setGroups(groups.value)
}

const actionManager = ref(new ActionManager(groups.value))

const addGroup = () => {
  actionManager.value.execute(AddGroupAction.of())
  postParentGroupsMutation(groups.value)
}

const addElement = (groupIndex: number) => {
  actionManager.value.execute(AddAction.of(groupIndex))
  postParentGroupsMutation(groups.value)
}
const deleteElement = (groupIndex: number, rowIndex: number) => {
  actionManager.value.execute(RemoveAction.of(groupIndex, rowIndex))
  postParentGroupsMutation(groups.value)
}
const copyElement = (groupIndex: number, rowIndex: number) => {
  actionManager.value.execute(CopyAction.of(groupIndex, rowIndex))
  postParentGroupsMutation(groups.value)
}

const checkTouchable = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0
const touchable = ref(checkTouchable())
const screen = ref(document.body.clientWidth > 768 ? 'md' : 'sm')

const onMessage = (event: MessageEvent) => {
  const [type, { groups }] = receiveFromParentMsg(event)
  if (['injectGroups'].includes(type)) setGroups(groups)
}
const onChangeGroup = (groupIndex: number, value: string) => {
  actionManager.value.execute(ChangeGroupName.of(groupIndex, value))
  postParentGroupsMutation(groups.value)
}

const onSetItem = (item: Partial<Item>) => {
  actionManager.value.execute(SetItem.of(item))
  postParentGroupsMutation(groups.value)
}

const onChangeItem = (
  id: string,
  field: NonFunctionPropertyNames<Item>,
  value: string
) => {
  actionManager.value.execute(ChangeItem.of(id, field, value))
  postParentGroupsMutation(groups.value)
}

const dragData = {
  fromGroupIndex: 0,
  fromItemIndex: 0,
  toGroupIndex: 0,
  toItemIndex: 0
}
const onDrag = (groupIndex: number, event: ItemDragEvent) => {
  if (event.moved) {
    actionManager.value.execute(
      DragMovedAction.of(
        groupIndex,
        Number(event.moved.newIndex),
        Number(event.moved.oldIndex)
      )
    )
  } else if (event.added) {
    dragData.toGroupIndex = groupIndex
    dragData.toItemIndex = Number(event.added?.newIndex)
  } else if (event.removed) {
    dragData.fromGroupIndex = groupIndex
    dragData.fromItemIndex = Number(event.removed.oldIndex)

    actionManager.value.execute(
      DragRemovedAction.of(JSON.parse(JSON.stringify(dragData)))
    )
    postParentGroupsMutation(groups.value)
  }
}

const onDragGroups = (event: ItemDragEvent) => {
  if (event.moved) {
    const { newIndex, oldIndex } = event.moved
    actionManager.value.execute(DragGroupsMovedAction.of(newIndex, oldIndex))
    postParentGroupsMutation(groups.value)
  }
}

window.addEventListener('message', onMessage)

window.addEventListener('keydown', ($event: KeyboardEvent) => {
  if ($event.key.toLowerCase() === 'z' && ($event.ctrlKey || $event.metaKey)) {
    $event.preventDefault()
    $event.shiftKey
      ? actionManager.value.executeRedo()
      : actionManager.value.executeUndo()
    postParentGroupsMutation(groups.value)
  }
})

window.addEventListener('resize', () => {
  touchable.value = checkTouchable()
  screen.value = document.body.clientWidth > 768 ? 'md' : 'sm'
})

provide('touchable', touchable)
provide('screen', screen)
</script>

<style scoped lang="scss">
.active {
  background: #1b98e0;
  color: white;
}
</style>
