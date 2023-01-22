<template>
  <button class="add-button bg-transparent border border-dashed border-slate-400 text-slate-500
  flex items-center justify-center self-start"
          @click="addElement"
          @drag.stop>
    <span class="icon icon-add text-xl">add_circle_outline</span>
    <span v-if="caption" class="caption ml-2">{{ caption }}</span>
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
    width: 150px;
    height: 150px;
  }

  &:hover {
    border: 1px dashed #1B98E0;
    color: #1B98E0;
    background: #E8F1F2;
  }
}
</style>