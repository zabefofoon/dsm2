<template>
  <draggable v-bind="dragOptions"
             :list="groups || []"
             :group="{put: false}"
             :disabled="disableDrag"
             @change="onGroupsChange">
    <div v-for="(group, groupIndex) in groups"
         class="tw-mb-2">
      <div class="tw-flex tw-items-center tw-mb-2">
        <button @click="toggleGroupHide(groupIndex)">
          <span v-if="isGroupHide[groupIndex]" class="tw-text-xl dsm-icon dsm-icon-arrow-top"></span>
          <span v-else class="tw-text-xl dsm-icon dsm-icon-arrow-bottom"></span>
        </button>
        <input class="tw-bg-transparent tw-px-1 tw-text-lg tw-border tw-border-0 tw-border-b tw-border-slate-400"
               placeholder="group name"
               :readonly="!editMode"
               :value="group.name"
               @change="changeGroup(groupIndex, $event)">
      </div>
      <template v-if="isGroupHide[groupIndex]">
        <draggable v-bind="dragOptions"
                   :list="group.items"
                   :disabled="disableDrag"
                   @change="onChange(groupIndex, $event)">
          <RowEditor v-for="(item, index) in group.items"
                     :key="index"
                     :item="item"
                     :edit-mode="editMode"
                     class="tw-mb-4"
                     @delete="deleteElement(groupIndex, index)"
                     @copy="copyElement(groupIndex, index)"
                     @edit-start="setDisableDrag(true)"
                     @edit-end="setDisableDrag(false)"
                     @change="(id, field, value) => emit('change-item', id, field, value)"/>
        </draggable>
        <AddMarkupButton v-if="editMode"
                         class="tw-p-2 tw-w-full"
                         caption="Add"
                         @add="addElement(groupIndex)"/>
      </template>

    </div>
  </draggable>

  <AddMarkupButton v-if="editMode"
                   class="group tw-w-full tw-p-2"
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
const emit = defineEmits(['delete', 'add', 'add-group', 'drag', 'drag-groups', 'copy', 'change-group', 'change-item'])

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}

const addGroup = (): void => emit('add-group')

const onChange = (groupIndex: number, $event: ItemDragEvent) => emit('drag', groupIndex, $event)

const onGroupsChange = ($event: ItemDragEvent) => emit('drag-groups', $event)

const copyElement = (groupIndex: number, index: number): void => emit('copy', groupIndex, index)
const deleteElement = (groupIndex: number, index: number): void => emit('delete', groupIndex, index)
const addElement = (groupIndex: number): void => emit('add', groupIndex)

const isGroupHide = ref<boolean[]>([])
const toggleGroupHide = (groupIndex: number) => {
  isGroupHide.value[groupIndex] = !isGroupHide.value[groupIndex]
}

const disableDrag = ref(false)
const setDisableDrag = (value: boolean) => {
  disableDrag.value = value
}

const changeGroup = (groupIndex: number, $event: Event) => {
  const value = (<HTMLInputElement>$event.target).value
  emit('change-group', groupIndex, value)
}

watch(() => [props.groups?.length],
    () => {
      isGroupHide.value = Array(props.groups?.length).fill(false)
    }, {immediate: true})
</script>

<style scoped lang="scss">

</style>