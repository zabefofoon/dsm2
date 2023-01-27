<template>
  <div class="thumbnail-container flex flex-wrap cursor-pointer">
    <div class="bg-white shadow-md relative overflow-hidden">
      <div class="thumbnail-cover absolute top-0 left-0 flex items-center z-10 pointer-events-none"
           :class="{active: isEdit[groupIndex][index], dragging}">
      </div>
      <div class="absolute top-0 left-0 z-10">
        <button v-if="editMode"
                class="dsm-button border border-solid border-slate-200 mt-2 ml-2 bg-white p-1 rounded-full self-start pointer-events-auto"
                @click="copyElement(groupIndex, index)">
          <span class="text-md icon icon-copy"></span>
        </button>
        <button v-if="editMode"
                class="dsm-button border border-solid border-slate-200 mt-2 ml-2 bg-white p-1 rounded-full self-start pointer-events-auto"
                @click="deleteElement(groupIndex, index)">
          <span class="text-md icon icon-delete"></span>
        </button>
      </div>
      <div class="thumbnail relative"
           @click="editing(groupIndex, index, true)">
        <div class="dsm p-1 w-fit absolute
                       left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div ref="itemElement"
               class="unreset"
               v-html="item.html"></div>
        </div>
      </div>
      <div v-if="item.name || item.description"
           class="thumbnail-info overflow-hidden w-full pt-1 pb-2 px-2 border-0 border-t border-solid border-slate-200">
        <h4 class="m-0 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
          {{ item.name }}
        </h4>
        <p class="m-0 font-light text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from "vue"
import {Item} from "../models/Item"

const fitItemToThumbnail = (item: HTMLElement) => {
  const thumbnail = item.parentElement?.parentElement
  const thumbnailWidth = thumbnail?.clientWidth || 0
  const thumbnailHeight = thumbnail?.clientHeight || 0
  const biggerAxisThumbnail = thumbnailWidth >= thumbnailHeight ? thumbnailWidth : thumbnailHeight

  const itemWidth = item.clientWidth
  const itemHeight = item.clientHeight
  const biggerAxisItem = itemWidth >= itemHeight ? itemWidth : itemHeight

  return biggerAxisItem >= biggerAxisThumbnail
      ? `scale(${biggerAxisThumbnail / biggerAxisItem - 0.1})`
      : `scale(1)`
}

const props = defineProps({
  isEdit: {
    type: Array as PropType<boolean[][]>,
    required: true
  },
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  groupIndex: {
    type: Number,
    required: true
  },
  dragging: {
    type: Boolean,
    required: true
  },
  editMode: Boolean
})

const emit = defineEmits(['editing', 'delete', 'copy'])

const itemElement = ref<HTMLElement | HTMLElement[]>()

const editing = (groupIndex: number,
                 index: number,
                 value: boolean) => emit('editing', groupIndex, index, value)

const deleteElement = (groupIndex: number,
                       index: number) => emit('delete', groupIndex, index)

const copyElement = (groupIndex: number,
                       index: number) => emit('copy', groupIndex, index)

watch(() => props.item,
    () => setTimeout(() => {
      if (itemElement.value)
        Array.isArray(itemElement.value)
            ? Array.from(itemElement.value).forEach((item) => item.style.transform = fitItemToThumbnail(item))
            : itemElement.value.style.transform = fitItemToThumbnail(itemElement.value)
    }), {immediate: true, deep: true})
</script>

<style scoped lang="scss">
.thumbnail-container {

  &:hover .thumbnail-cover {
    display: flex;

    &.dragging {
      display: none;
    }
  }

  .thumbnail {
    width: 150px;
    height: 150px;
  }

  .thumbnail-cover {
    background: rgba(#1B98E0, .2);
    width: 150px;
    height: 100%;
    display: none;
  }

  .thumbnail-info {
    width: 150px;
  }
}
</style>