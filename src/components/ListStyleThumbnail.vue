<template>
  <div class="margin-bottom-1">
    <div v-for="(group, groupIndex) in groups"
         :key="groupIndex"
         class="margin-bottom-1">
      <div class="display-flex align-items-center margin-bottom-1">
        <button class="border-none cursor-pointer"
                @click="toggleGroupHide(groupIndex)">
          <span v-if="isGroupHide[groupIndex]" class="text-1dot5 icon icon-arrow-top"></span>
          <span v-else class="text-1 icon icon-arrow-bottom"></span>
        </button>
        <input class="input-group-name"
               placeholder="group name"
               v-model="group.name">
      </div>

      <div v-if="isGroupHide[groupIndex]"
           class="display-flex flex-wrap align-items-center gap-2">
        <draggable class="margin-bottom-1 display-flex gap-2 align-items-center flex-wrap"
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
                       @editing="editing"
                       @delete="deleteElement"/>
            <div v-if="isEdit[groupIndex].findIndex((edit) => edit) === index"
                 class="width-100vw">
              <RowEditor :item="group.items[isEdit[groupIndex].findIndex((item) => item)]"
                         show-close-button
                         @close="editing(groupIndex, isEdit[groupIndex].findIndex((item) => item), false)"
                         @delete="deleteElement(groupIndex, isEdit[groupIndex].findIndex((item) => item))"/>
            </div>
          </template>
          <AddMarkupButton class="thumbnail"
                           @add="addElement(groupIndex)"/>
        </draggable>

      </div>
    </div>
    <AddMarkupButton class="group"
                     caption="Group"
                     @add="addGroup"/>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from "vue"
import {Group, ItemDragEvent} from "../models/Item"
import AddMarkupButton from "./AddMarkupButton.vue"
import RowEditor from "./RowEditor.vue"
import {VueDraggableNext as Draggable} from "vue-draggable-next"
import Thumbnail from "./Thumbnail.vue"

const props = defineProps({
  groups: Array as PropType<Group[]>
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