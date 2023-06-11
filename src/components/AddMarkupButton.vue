<template>
  <button class="add-button | tw-bg-transparent tw-border tw-border-dashed tw-border-slate-400 tw-text-slate-500
  tw-flex tw-items-center tw-justify-center tw-self-start"
          @click="addElement"
          @drag.stop>
    <span class="dsm-icon dsm-icon-add tw-text-xl">add_circle_outline</span>
    <span v-if="caption" class="caption tw-ml-2">{{ caption }}</span>
  </button>
</template>

<script setup lang="ts">
import {defineEmits} from "vue"

defineProps({
  caption: {
    type: String
  }
})
const emit = defineEmits(['add'])
const addElement = () => emit('add')
</script>

<style scoped lang="scss">
.add-button {

  &.thumbnail {
    aspect-ratio: 1;
    width: 100%;
    @media (min-width: 768px) {
      width: 150px;
    }
  }

  &:hover {
    border: 1px dashed #1B98E0;
    color: #1B98E0;
    background: #E8F1F2;
  }
}
</style>