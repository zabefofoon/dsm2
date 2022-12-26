<template>
  <div v-for="(group, groupIndex) in groups"
       class="margin-bottom-1">
    <button class="border-none cursor-pointer"
            @click="toggleGroupHide(groupIndex)">
      <span v-if="isGroupHide[groupIndex]" class="material-icons-outlined">expand_less</span>
      <span v-else class="material-icons-outlined">expand_more</span>
    </button>
    <input class="input-group-name margin-bottom-1 position-relative z-index-2"
           placeholder="group name"
           v-model="group.name">
    <template v-if="isGroupHide[groupIndex]">
      <draggable
          v-bind="dragOptions"
          :list="group.items"
          @change="onChange(groupIndex, $event)">
        <RowEditor v-for="(item, index) in group.items"
                   :key="index"
                   :item="item"
                   class="margin-bottom-1"
                   @delete="deleteElement(groupIndex, index)"/>
      </draggable>

      <AddMarkupButton class="bullet" @add="addElement(groupIndex)"/>
    </template>

  </div>
  <AddMarkupButton class="margin-bottom-5 group"
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