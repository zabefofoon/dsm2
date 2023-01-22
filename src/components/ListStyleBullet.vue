<template>
  <div v-for="(group, groupIndex) in groups"
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
    <template v-if="isGroupHide[groupIndex]">
      <draggable v-bind="dragOptions"
                 :list="group.items"
                 @change="onChange(groupIndex, $event)">
        <RowEditor v-for="(item, index) in group.items"
                   :key="index"
                   :item="item"
                   :edit-mode="editMode"
                   class="mb-4"
                   @delete="deleteElement(groupIndex, index)"/>
      </draggable>

      <AddMarkupButton v-if="editMode"
                       class="p-2 w-full"
                       @add="addElement(groupIndex)"/>
    </template>

  </div>
  <AddMarkupButton v-if="editMode"
                   class="w-full p-2 group"
                   caption="Group"
                   @add="addGroup"/>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from "vue"
import {Group, ItemDragEvent} from "../models/Item"
import AddMarkupButton from "./AddMarkupButton.vue"
import RowEditor from "./RowEditor.vue"
import {VueDraggableNext as Draggable} from "vue-draggable-next"

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

const onChange = (groupIndex: number, $event: ItemDragEvent) => emit('drag', groupIndex, $event)

const deleteElement = (groupIndex: number, index: number): void => emit('delete', groupIndex, index)
const addElement = (groupIndex: number): void => emit('add', groupIndex)

const isGroupHide = ref<boolean[]>([])
const toggleGroupHide = (groupIndex: number) => {
  isGroupHide.value[groupIndex] = !isGroupHide.value[groupIndex]
}
watch(() => [props.groups?.length, props.groups?.map((group) => group.items)?.flat().length],
    () => {
      isGroupHide.value = Array(props.groups?.length).fill(false)
    }, {immediate: true})
</script>

<style scoped lang="scss">

</style>