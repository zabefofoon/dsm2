<template>
  <div class="thumbnail-container display-flex flex-wrap">
    <div class="bg-white box-shadow position-relative over-flow-hidden">
      <div class="thumbnail-cover position-absolute top-0 left-0 display-flex
        align-items-center justify-content-center gap-dot-5 z-index-2 padding-dot-5"
           :class="{active: isEdit[groupIndex][index], dragging}">
        <button class="dsm-button padding-dot-5 align-self-start margin-right-auto"
                @click="deleteElement(groupIndex, index)">
          <span class="material-icons-outlined">delete</span>
        </button>
        <div class="info width-100per position-absolute bottom-0 padding-dot-5 text-white">
          <h4 class="whitespace-nowrap  over-flow-hidden text-overflow-ellipsis">
            {{ item.name }}
          </h4>
          <p class="whitespace-nowrap  over-flow-hidden text-overflow-ellipsis">
            {{ item.description }}
          </p>
        </div>
      </div>
      <div class="thumbnail position-relative"
           @click="editing(groupIndex, index, true)">
        <div class="dsm padding-dot-5-1 width-fit-content position-absolute
                       left-50per top-50per translate-minus-50-minus-50">
          <div ref="itemElement" v-html="item.html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Prop, PropType, ref, watch} from "vue"
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

})

const emit = defineEmits(['editing', 'delete'])

const itemElement = ref<HTMLElement | HTMLElement[]>()

const editing = (groupIndex: number,
                 index: number,
                 value: boolean) => emit('editing', groupIndex, index, value)

const deleteElement = (groupIndex: number,
                       index: number) => emit('delete', groupIndex, index)


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
  cursor: pointer;

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
    background: rgba(#1B98E0, .8);
    width: 150px;
    height: 150px;
    display: none;
    pointer-events: none;

    button {
      pointer-events: all;
    }

    &.active {
      display: flex;
    }
  }
}
</style>