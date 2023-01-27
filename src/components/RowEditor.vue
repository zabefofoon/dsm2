<template>
  <div class="bg-white shadow-md p-4"
       v-click-away="() => close()"
       @keydown.stop>
    <div class="flex gap-1 mb-4">
      <button v-if="editMode"
              class="dsm-button bg-white border border-solid border-slate-200 rounded-full p-1 h-fit shadow-md"
              @click="copyElement">
        <span class="text-lg icon icon-copy"></span>
      </button>
      <button v-if="editMode"
              class="dsm-button bg-white border border-solid border-slate-200 rounded-full p-1 h-fit shadow-md"
              @click="deleteElement">
        <span class="text-lg icon icon-delete"></span>
      </button>
      <button v-if="showCloseButton"
              class="dsm-button bg-white border border-solid border-slate-200 rounded-full p-1 h-fit shadow-md"
              @click="close">
        <span class="text-lg icon icon-close"></span>
      </button>
    </div>
    <div class="mb-4">
      <input class="w-full p-2 mb-2 border border-0 border-b border-slate-300"
             type="text"
             placeholder="name"
             v-model="item.name"
             :readonly="!editMode"
             @focusin="$emit('edit-start')"
             @focusout="$emit('edit-end')"/>
      <input class="w-full p-2 border border-0 border-b border-slate-300"
             placeholder="description"
             v-model="item.description"
             :readonly="!editMode"
             @focusin="$emit('edit-start')"
             @focusout="$emit('edit-end')"/>
    </div>
    <div class="flex gap-1">
      <div class="flex-1 overflow-auto shadow-md p-4">
        <h4 class="mb-2">html</h4>
        <codemirror v-model="item.html"
                    placeholder="Html goes here..."
                    :style="{ height: 'fit-content',
                     fontSize: '.9rem' }"
                    :tab-size="4"
                    :extensions="[html()]"
                    @focusin="$emit('edit-start')"
                    @focusout="$emit('edit-end')"/>
      </div>
      <div class="flex-1 overflow-auto shadow-md p-4">
        <h4 class="mb-2">css</h4>
        <codemirror v-model="item.css"
                    placeholder="Css goes here..."
                    :style="{ height: 'fit-content',
                     fontSize: '.9rem' }"
                    :tab-size="4"
                    :extensions="[css()]"
                    @focusin="$emit('edit-start')"
                    @focusout="$emit('edit-end')"/>
      </div>
      <div class="dsm flex-2 overflow-auto shadow-md p-4">
        <h4 class="mb-2">preview</h4>
        <div class="unreset"
             v-html="item.html"
             @focusin="$emit('edit-start')"
             @focusout="$emit('edit-end')"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Item} from "../models/Item"
import {Codemirror} from 'vue-codemirror'
import {html} from "@codemirror/lang-html"
import {css} from "@codemirror/lang-css"
import {PropType} from "vue"
import {directive as vClickAway} from "vue3-click-away"

defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  showCloseButton: Boolean,
  editMode: Boolean
})
const emit = defineEmits(['delete', 'close', 'copy', 'edit-start', 'edit-end'])
const deleteElement = (): void => emit('delete')
const copyElement = (): void => emit('copy')
const close = (): void => emit('close')
</script>

<style scoped lang="scss">

</style>