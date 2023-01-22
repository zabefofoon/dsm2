<template>
  <div v-for="(group, groupIndex) in groups"
       :key="groupIndex"
       class="mb-2">
    <div class="flex items-center mb-2">
      <button @click="toggleGroupHide(groupIndex)">
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
      <draggable class="w-full mb-1 flex gap-2 items-center flex-wrap"
                 :list="group.items"
                 v-bind="dragOptions"
                 draggable=".draggable"
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
                     @delete="deleteElement"/>
          <div v-if="isEdit[groupIndex].findIndex((edit) => edit) === index"
               class="w-full">
            <RowEditor :item="group.items[isEdit[groupIndex].findIndex((item) => item)]"
                       :edit-mode="editMode"
                       show-close-button
                       @close="editing(groupIndex, isEdit[groupIndex].findIndex((item) => item), false)"
                       @delete="deleteElement(groupIndex, isEdit[groupIndex].findIndex((item) => item))"/>
          </div>
        </template>
        <AddMarkupButton v-if="editMode"
                         class="thumbnail"
                         @add="addElement(groupIndex)"/>
      </draggable>

    </div>
  </div>
  <AddMarkupButton v-if="editMode"
                   class="w-full p-2"
                   caption="Group"
                   @add="addGroup"/>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from "vue"
import {Group, ItemDragEvent} from "../models/Item"
import AddMarkupButton from "./AddMarkupButton.vue"
import RowEditor from "./RowEditor.vue"
import {VueDraggableNext as Draggable} from "vue-draggable-next"
import Thumbnail from "./Thumbnail.vue"

const props = defineProps({
  groups: Array as PropType<Group[]>,
  editMode: Boolean
})

const emit = defineEmits(['delete', 'add', 'add-group', 'drag'])

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}

const addGroup = (): void => emit('add-group')

const deleteElement = (groupIndex: number, index: number): void => emit('delete', groupIndex, index)
const addElement = (groupIndex: number): void => emit('add', groupIndex)

const isEdit = ref<boolean[][]>([])
const editing = (groupIndex: number, index: number, value: boolean) => {
  isEdit.value.forEach((items) => items.fill(false))
  isEdit.value[groupIndex][index] = value
}
const dragging = ref(false)
const onChange = (groupIndex: number, $event: ItemDragEvent) => emit('drag', groupIndex, $event)

const isGroupHide = ref<boolean[]>([])
const toggleGroupHide = (groupIndex: number) => {
  isGroupHide.value[groupIndex] = !isGroupHide.value[groupIndex]
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