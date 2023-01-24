<template>
  <div class="p-3 pt-0 bg-gray-100 h-fit min-h-screen overflow-hidden">
    <UiStyle>{{ createCss('.dsm') }}</UiStyle>
    <div class="bg-gray-100 py-3 flex gap-2 sticky top-0 left-0 z-10 text-slate-500">
      <button class="dsm-button shadow-lg h-fit p-2 bg-white rounded-full"
              :class="{active: !isShowAllCodes && listStyle === 'thumbnail'}"
              @click="setListStyle('thumbnail');toggleAllCode(false)">
        <span class="text-lg icon icon-widgets"></span>
      </button>
      <button class="dsm-button shadow-lg h-fit p-2 bg-white rounded-full"
              :class="{active: !isShowAllCodes && listStyle === 'bullet'}"
              @click="setListStyle('bullet');toggleAllCode(false)">
        <span class="text-lg icon icon-bullet">format_list_bulleted</span>
      </button>
      <button class="dsm-button shadow-lg h-fit p-2 bg-white rounded-full"
              :class="{active: isShowAllCodes}"
              @click="toggleAllCode(!isShowAllCodes)">
        <span class="text-lg icon icon-code">code</span>
      </button>
      <button v-if="editMode"
              class="dsm-button shadow-lg h-fit p-2 bg-white rounded-full"
              @click="postSave">
        <span class="text-lg icon icon-save">save</span>
      </button>
    </div>
    <AllCodes v-if="isShowAllCodes"
              :groups="groups"
              :edit-mode="editMode"/>
    <template v-else>
      <ListStyleBullet v-if="listStyle === 'bullet'"
                       :groups="groups"
                       :edit-mode="editMode"
                       @delete="deleteElement"
                       @add="addElement"
                       @add-group="addGroup"/>
      <ListStyleThumbnail v-else
                          :groups="groups"
                          :edit-mode="editMode"
                          @delete="deleteElement"
                          @add="addElement"
                          @add-group="addGroup"
                          @drag="onDrag"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue"
import UiStyle from "./components/UiStyle.vue"
import {Group, ItemDragEvent} from "./models/Item"
import ListStyleBullet from "./components/ListStyleBullet.vue"
import ListStyleThumbnail from "./components/ListStyleThumbnail.vue"
import AllCodes from "./components/AllCodes.vue"
import {ActionManager} from "./models/ActionManager"
import {AddAction, AddGroupAction, DragMovedAction, DragRemovedAction, RemoveAction} from "./models/BasicActions"

type ListType = 'thumbnail' | 'bullet'

const listStyle = ref<ListType>('thumbnail')
const setListStyle = (listType: ListType): void => {
  listStyle.value = listType
}
const groups = ref<Group[]>([])
let actionManager = new ActionManager(groups.value)

const setGroups = (_groups: Group[]) => {
  groups.value = _groups
  actionManager = new ActionManager(groups.value)
}
window.addEventListener('keydown', ($event: KeyboardEvent) => {
  if ($event.key.toLowerCase() === 'z'
      && ($event.ctrlKey || $event.metaKey))
    $event.shiftKey
        ? actionManager.executeRedo()
        : actionManager.executeUndo()
})

const addGroup = () => {
  actionManager.execute(AddGroupAction.of())
}

const addElement = (groupIndex: number) => actionManager.execute(AddAction.of(groupIndex))
const deleteElement = (groupIndex: number, rowIndex: number) => actionManager.execute(RemoveAction.of(groupIndex, rowIndex))

const isShowAllCodes = ref(false)
const toggleAllCode = (value: boolean) => {
  isShowAllCodes.value = value
}
const dragData = {
  fromGroupIndex: 0,
  fromItemIndex: 0,
  toGroupIndex: 0,
  toItemIndex: 0
}

const onDrag = (groupIndex: number, event: ItemDragEvent) => {
  if (event.moved) {
    actionManager.execute(DragMovedAction.of(groupIndex, Number(event.moved.newIndex), Number(event.moved.oldIndex)))
  } else if (event.added) {
    dragData.toGroupIndex = groupIndex
    dragData.toItemIndex = Number(event.added?.newIndex)
  } else if (event.removed) {
    dragData.fromGroupIndex = groupIndex
    dragData.fromItemIndex = Number(event.removed.oldIndex)

    actionManager.execute(DragRemovedAction.of(JSON.parse(JSON.stringify(dragData))))
  }
}

const createCss = (parentClass?: string) => {
  const x = groups.value
      .map((group) => group.items)
      .flat()
      .reduce((acc, current) => current?.css
          ? acc + current.css
          : acc, '')
  console.log(x)

  return groups.value
      .map((group) => group.items)
      .flat()
      .reduce((acc, current) => current?.css
          ? acc + current.css
          : acc, '')
}

const editMode = computed(() => location.search.includes('save=true'))

const postSave = () => window.parent.postMessage({
  type: 'saveGroups',
  groups: JSON.stringify(groups.value)
}, '*')

const onMessage = () => (event: MessageEvent) => {
  if (event.data.type === 'loadGroups') setGroups(event.data.groups)
}

window.addEventListener('message', onMessage())

</script>

<style scoped lang="scss">
.active {
  background: #1B98E0;
  color: white;
}
</style>
