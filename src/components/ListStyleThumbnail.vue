<template>
  <draggable v-bind="dragOptions"
             :list="groups"
             :group="{put: false}"
             :disabled="disableDrag"
             filter=".ignore-elements"
             @change="onGroupsChange">
    <div v-for="(group, groupIndex) in groups"
         :key="groupIndex"
         class="mb-2">
      <div class="flex items-center mb-2">
        <button class="dsm-button"
                @click="toggleGroupHide(groupIndex)">
          <span v-if="isGroupHide[groupIndex]" class="text-xl icon icon-arrow-top"></span>
          <span v-else class="text-xl icon icon-arrow-bottom"></span>
        </button>
        <input class="bg-transparent px-1 text-lg border border-0 border-b border-slate-400"
               placeholder="group name"
               v-model="group.name"
               :readonly="!editMode">
      </div>

      <div v-if="isGroupHide[groupIndex]"
           class="flex flex-wrap items-center gap-2">
        <draggable class="w-full mb-1 grid grid-cols-2 md:flex gap-2 flex-wrap items-start"
                   :list="group.items"
                   v-bind="dragOptions"
                   draggable=".draggable"
                   :disabled="disableDrag"
                   @start="dragging = true"
                   @end="dragging = false"
                   @change="onChange(groupIndex, $event)">
          <template v-for="(item, index) in group.items"
                    :key="`${index}${group.items.length}`">
            <Thumbnail class="draggable"
                       :is-edit="isEdit"
                       :index="index"
                       :group-index="groupIndex"
                       :dragging="dragging"
                       :item="item"
                       :edit-mode="editMode"
                       @editing="editing"
                       @delete="deleteElement"
                       @copy="copyElement"/>
            <div v-if="isEdit[groupIndex].findIndex((edit) => edit) === index"
                 class="hidden md:block w-full">
              <RowEditor :item="group.items[isEdit[groupIndex].findIndex((item) => item)]"
                         :edit-mode="editMode"
                         show-close-button
                         @close="editing(groupIndex, isEdit[groupIndex].findIndex((item) => item), false)"
                         @delete="deleteElement(groupIndex, isEdit[groupIndex].findIndex((item) => item))"
                         @copy="copyElement(groupIndex, isEdit[groupIndex].findIndex((item) => item))"
                         @edit-start="setDisableDrag(true)"
                         @edit-end="setDisableDrag(false)"/>
            </div>
          </template>
          <AddMarkupButton v-if="editMode"
                           class="thumbnail"
                           @add="addElement(groupIndex)"/>
        </draggable>

      </div>
    </div>
  </draggable>
  <AddMarkupButton v-if="editMode"
                   class="w-full p-2"
                   caption="Group"
                   @add="addGroup"/>
</template>

<script setup lang="ts">
import {inject, PropType, Ref, ref, watch} from "vue"
import {Group, Item, ItemDragEvent} from "../models/Item"
import AddMarkupButton from "./AddMarkupButton.vue"
import RowEditor from "./RowEditor.vue"
import {VueDraggableNext as Draggable} from "vue-draggable-next"
import Thumbnail from "./Thumbnail.vue"
import {$vfm} from "vue-final-modal"
import ModalEditor from "./ModalEditor.vue"

const touchable = inject<Ref<boolean>>('touchable')
const screen = inject<Ref<string>>('screen')
const props = defineProps({
  groups: Array as PropType<Group[]>,
  editMode: Boolean
})

const emit = defineEmits(['delete', 'add', 'add-group', 'drag', 'drag-groups', 'copy'])

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}

const addGroup = (): void => emit('add-group')

const copyElement = (groupIndex: number, index: number): void => emit('copy', groupIndex, index)
const deleteElement = (groupIndex: number, index: number): void => emit('delete', groupIndex, index)
const addElement = (groupIndex: number): void => emit('add', groupIndex)
const onGroupsChange = ($event: ItemDragEvent) => emit('drag-groups', $event)

const isEdit = ref<boolean[][]>([])
const editing = (groupIndex: number, index: number, value: boolean) => {
  isEdit.value.forEach((items) => items.fill(false))
  isEdit.value[groupIndex][index] = value
}

type EditingData = { groupIndex: number, valueIndex: number, item?: Item }
const getEditingData = (): EditingData | undefined => {
  let groupIndex = 0,
      valueIndex = 0,
      item
  isEdit.value.forEach((group, _groupIndex) => {
    group?.forEach((value, index) => {
      if (value) {
        groupIndex = _groupIndex
        valueIndex = index
        item = props.groups?.[_groupIndex].items[index]
      }
    })
  })

  return isEdit.value.flat().find((item) => item)
      ? {groupIndex, valueIndex, item}
      : undefined
}

watch([isEdit, screen],
    async () => {
      if (screen?.value === 'sm') {
        const editingData = getEditingData()
        if (editingData) showEditorModal(editingData)
      } else
        await $vfm.hideAll()
    }, {immediate: true, deep: true})

const showEditorModal = ({groupIndex, valueIndex, item}: EditingData) => {
  $vfm.show({
    component: ModalEditor,
    bind: {
      item,
      editMode: props.editMode
    },
    on: {
      done: ({name, description, html, css}: { [key in string]: string }) => {
        if (props.groups?.[groupIndex]?.items[valueIndex]) {
          props.groups[groupIndex].items[valueIndex].name = name
          props.groups[groupIndex].items[valueIndex].description = description
          props.groups[groupIndex].items[valueIndex].html = html
          props.groups[groupIndex].items[valueIndex].css = css
        }
      }
    }
  })
}


const dragging = ref(false)
const onChange = (groupIndex: number, $event: ItemDragEvent) => emit('drag', groupIndex, $event)

const isGroupHide = ref<boolean[]>([])
const toggleGroupHide = (groupIndex: number) => {
  isGroupHide.value[groupIndex] = !isGroupHide.value[groupIndex]
}

const disableDrag = ref<boolean>(touchable?.value || false)
const setDisableDrag = (value: boolean) => {
  disableDrag.value = touchable?.value ? true : value
}

watch(() => [props.groups?.length, props.groups?.map((group) => group.items)?.flat().length],
    () => {
      isGroupHide.value = Array(props.groups?.length).fill(true)

      isEdit.value = props.groups
          ?.reduce<boolean[][]>((acc, current, index) => {
            acc[index] = Array(current.items.length).fill(false)
            return acc
          }, []) || []
    }, {immediate: true})

</script>

<style scoped lang="scss">


</style>