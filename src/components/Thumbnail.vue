<template>
  <div class="tw-w-full md:tw-w-fit thumbnail-container tw-flex tw-flex-wrap tw-cursor-pointer">
    <div class="tw-w-full md:tw-w-fit tw-bg-white tw-shadow-md tw-relative tw-overflow-hidden hover:tw-shadow-sm
        tw-transition-shadow tw-transition-border"
         :class="isEditing ? ['shadow-sm'] : [dragging]">
      <div class="thumbnail-cover | tw-absolute tw-top-0 tw-left-0 tw-flex tw-items-center tw-z-10 tw-pointer-events-none">
        <button v-if="editMode"
                class="tw-shadow-sm tw-border tw-border-solid tw-border-slate-200 tw-mt-2 tw-ml-1 tw-bg-white tw-p-1 tw-rounded-full tw-self-start tw-pointer-events-auto hover:tw-bg-slate-200"
                @click="copyElement(groupIndex, index)">
          <span class="tw-text-md dsm-icon dsm-icon-copy"></span>
        </button>
        <button v-if="editMode"
                class="tw-shadow-sm tw-border tw-border-solid tw-border-slate-200 tw-mt-2 tw-ml-1 tw-bg-white tw-p-1 tw-rounded-full tw-self-start tw-pointer-events-auto hover:tw-bg-slate-200"
                @click="deleteElement(groupIndex, index)">
          <span class="tw-text-md dsm-icon dsm-icon-delete"></span>
        </button>
      </div>
      <div class="thumbnail | tw-relative"
           @click="editing(groupIndex, index, true)">
        <div class="dsm tw-p-1 tw-w-fit tw-absolute
                       tw-left-1/2 tw-top-1/2 tw--translate-x-1/2 tw--translate-y-1/2">
          <div ref="itemElement"
               v-html="item.html"></div>
        </div>
      </div>
      <div v-if="item.name || item.description"
           class="thumbnail-info tw-text-slate-500 tw-overflow-hidden tw-w-full tw-pt-1 tw-pb-2 tw-px-2 tw-border-0 tw-border-t tw-border-solid tw-border-slate-200">
        <h4 class="tw-m-0 tw-text-sm tw-whitespace-nowrap tw-overflow-hidden tw-overflow-ellipsis">
          {{ item.name }}
        </h4>
        <p class="tw-m-0 tw-font-light tw-text-sm tw-whitespace-nowrap tw-overflow-hidden tw-overflow-ellipsis">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, PropType, ref, watch} from "vue"
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

const isEditing = computed(() => props.isEdit[props.groupIndex][props.index])

const emit = defineEmits(['editing', 'delete', 'copy'])

const itemElement = ref<HTMLElement | HTMLElement[]>()

const editing = (groupIndex: number,
                 index: number,
                 value: boolean) => emit('editing', groupIndex, index, value)

const deleteElement = (groupIndex: number,
                       index: number) => emit('delete', groupIndex, index)

const copyElement = (groupIndex: number,
                     index: number) => emit('copy', groupIndex, index)

const fit = () => {
  if (itemElement.value) Array.isArray(itemElement.value)
      ? Array.from(itemElement.value).forEach((item) => item.style.transform = fitItemToThumbnail(item))
      : itemElement.value.style.transform = fitItemToThumbnail(itemElement.value)
}

onMounted(() => setTimeout(fit, 1000))

watch(() => props.item,
    () => setTimeout(fit),
    {immediate: true, deep: true})
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

    aspect-ratio: 1;
    @media (min-width: 768px) {
      width: 150px;
    }
  }

  .thumbnail-cover {
    height: 100%;
    display: none;
    @media (min-width: 768px) {
      width: 150px;
    }
  }

  .thumbnail-info {
    @media (min-width: 768px) {
      width: 150px;
    }
  }
}
</style>