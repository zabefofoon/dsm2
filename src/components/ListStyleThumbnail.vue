<template>
  <draggable
    v-bind="dragOptions"
    :list="groups || []"
    :group="{ put: false }"
    :disabled="disableDrag"
    filter=".ignore-elements"
    @change="onGroupsChange">
    <div
      v-for="(group, groupIndex) in groups"
      :key="groupIndex"
      class="tw-mb-2">
      <div class="tw-flex tw-items-center tw-mb-2">
        <button @click="toggleGroupHide(groupIndex)">
          <span
            v-if="isGroupHide[groupIndex]"
            class="tw-text-xl dsm-icon dsm-icon-arrow-top"></span>
          <span
            v-else
            class="tw-text-xl dsm-icon dsm-icon-arrow-bottom"></span>
        </button>
        <input
          class="tw-bg-transparent tw-border-b tw-px-1 tw-text-lg tw-border-slate-400"
          placeholder="group name"
          :readonly="!editMode"
          :value="group.name"
          @change="changeGroup(groupIndex, $event)" />
      </div>

      <div
        v-if="isGroupHide[groupIndex]"
        class="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
        <draggable
          class="tw-w-full tw-mb-1 tw-grid tw-grid-cols-2 md:tw-flex tw-gap-2 tw-flex-wrap tw-items-start"
          :list="group.items"
          v-bind="dragOptions"
          draggable=".draggable"
          :disabled="disableDrag"
          @start="dragging = true"
          @end="dragging = false"
          @change="onChange(groupIndex, $event)">
          <template
            v-for="(item, index) in group.items"
            :key="`${index}${group.items.length}`">
            <Thumbnail
              class="draggable"
              :is-edit="isEdit"
              :index="index"
              :group-index="groupIndex"
              :dragging="dragging"
              :item="item"
              :edit-mode="editMode"
              @editing="editing(item)"
              @delete="deleteElement"
              @copy="copyElement" />
          </template>
          <AddMarkupButton
            v-if="editMode"
            class="thumbnail"
            @add="addElement(groupIndex)" />
        </draggable>
      </div>
    </div>
  </draggable>
  <AddMarkupButton
    v-if="editMode"
    class="tw-w-full tw-p-2"
    caption="Group"
    @add="addGroup" />
</template>

<script setup lang="ts">
import { inject, type PropType, type Ref, ref, watch } from 'vue'
import { Group, Item, type ItemDragEvent } from '../models/Item'
import AddMarkupButton from './AddMarkupButton.vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import Thumbnail from './Thumbnail.vue'
import ModalEditor from './ModalEditor.vue'
import { useModal } from 'vue-final-modal'

const touchable = inject<Ref<boolean>>('touchable')
const props = defineProps({
  groups: Array as PropType<Group[]>,
  editMode: Boolean
})

const emit = defineEmits([
  'delete',
  'add',
  'add-group',
  'drag',
  'drag-groups',
  'copy',
  'change-item',
  'change-group',
  'set-item'
])

const { open, close, patchOptions } = useModal({
  component: ModalEditor,
  attrs: {
    onDone: (item: Partial<Item>) => {
      // emit('change-item', item.id, 'html', item.html)
      emit('set-item', item)
      close()
    },
    onCancel: () => close()
  }
})

const dragOptions = {
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost'
}

const addGroup = () => emit('add-group')

const copyElement = (groupIndex: number, index: number): void =>
  emit('copy', groupIndex, index)
const deleteElement = (groupIndex: number, index: number): void =>
  emit('delete', groupIndex, index)
const addElement = (groupIndex: number): void => emit('add', groupIndex)
const onGroupsChange = ($event: ItemDragEvent) => emit('drag-groups', $event)

const isEdit = ref<boolean[][]>([])
const editing = (item: Item) => {
  patchOptions({
    attrs: {
      editMode: location.search.includes('edit=true'),
      item
    }
  })
  open()
}

const dragging = ref(false)
const onChange = (groupIndex: number, $event: ItemDragEvent) =>
  emit('drag', groupIndex, $event)

const isGroupHide = ref<boolean[]>([])
const toggleGroupHide = (groupIndex: number) => {
  isGroupHide.value[groupIndex] = !isGroupHide.value[groupIndex]
}

const disableDrag = ref<boolean>(touchable?.value || false)

watch(
  () => [
    props.groups?.length,
    props.groups?.map(group => group.items)?.flat().length
  ],
  () => {
    isGroupHide.value = Array(props.groups?.length).fill(true)

    isEdit.value =
      props.groups?.reduce<boolean[][]>((acc, current, index) => {
        acc[index] = Array(current.items.length).fill(false)
        return acc
      }, []) || []
  },
  { immediate: true }
)

const changeGroup = (groupIndex: number, $event: Event) => {
  const value = (<HTMLInputElement>$event.target).value
  emit('change-group', groupIndex, value)
}
</script>

<style scoped lang="scss"></style>
