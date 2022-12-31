<template>
  <button class="add-button"
          @click="addElement"
          @drag.stop>
    <span class="icon icon-add text-1dot5 padding-right-3">add_circle_outline</span>
    <span class="caption">{{ caption }}</span>
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
  background: none;
  border: 1px dashed gray;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: start;
  cursor: pointer;

  &.thumbnail {
    width: 150px;
    height: 150px;
  }

  &.group {
    width: 100%;
    padding: 1rem;
  }

  &.bullet {
    width: 100%;
    padding: 1rem;
  }

  &:hover {
    border: 1px dashed #1B98E0;
    color: #1B98E0;
    background: #E8F1F2;
  }
}
</style>