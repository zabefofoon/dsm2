<template>
  <div class="tw-bg-white tw-shadow-md tw-p-4"
       v-click-away="() => !touchable && close()"
       tabindex="0"
       @keydown.stop>
    <div class="tw-flex tw-gap-1 tw-mb-4">
      <button v-if="editMode"
              class="tw-bg-white tw-border tw-border-solid tw-border-slate-200 tw-rounded-full tw-p-1 tw-h-fit tw-shadow-md"
              @click="copyElement">
        <span class="tw-text-lg dsm-icon dsm-icon-copy"></span>
      </button>
      <button v-if="editMode"
              class="tw-bg-white tw-border tw-border-solid tw-border-slate-200 tw-rounded-full tw-p-1 tw-h-fit tw-shadow-md"
              @click="deleteElement">
        <span class="tw-text-lg dsm-icon dsm-icon-delete"></span>
      </button>
      <button v-if="showCloseButton"
              class="tw-bg-white tw-border tw-border-solid tw-border-slate-200 tw-rounded-full tw-p-1 tw-h-fit tw-shadow-md"
              @click="close">
        <span class="tw-text-lg dsm-icon dsm-icon-close"></span>
      </button>
    </div>
    <div class="tw-mb-4">
      <input class="tw-w-full tw-p-2 tw-mb-2 tw-border tw-border-0 tw-border-b tw-border-slate-300"
             type="text"
             placeholder="name"
             :value="item.name"
             @change="changeItem('name', $event)"
             :readonly="!editMode"
             @focusin="$emit('edit-start')"
             @focusout="$emit('edit-end')"/>
      <input class="tw-w-full tw-p-2 tw-border tw-border-0 tw-border-b tw-border-slate-300"
             placeholder="description"
             :value="item.description"
             @change="changeItem('description', $event)"
             :readonly="!editMode"
             @focusin="$emit('edit-start')"
             @focusout="$emit('edit-end')"/>
    </div>
    <div class="tw-flex tw-gap-1">
      <div class="tw-flex-1 tw-overflow-auto tw-shadow-md tw-p-4">
        <h4 class="tw-mb-2">html</h4>
        <div class="tw-max-h-96">
          <codemirror :model-value="item.html"
                      @change="changeItem('html', $event)"
                      placeholder="Html goes here..."
                      :style="{ height: 'fit-content', fontSize: '.9rem' }"
                      :tab-size="4"
                      :extensions="[html()]"
                      @focusin="$emit('edit-start')"
                      @focusout="$emit('edit-end')"/>
        </div>
      </div>
      <div class="tw-flex-1 tw-overflow-auto tw-shadow-md tw-p-4">
        <h4 class="tw-mb-2">css</h4>
        <div class="tw-max-h-96">
          <codemirror :model-value="item.css"
                      @change="changeItem('css', $event)"
                      placeholder="Css goes here..."
                      :style="{ height: 'fit-content', fontSize: '.9rem' }"
                      :tab-size="4"
                      :extensions="[css()]"
                      @focusin="$emit('edit-start')"
                      @focusout="$emit('edit-end')"/>
        </div>
      </div>
      <div class="dsm tw-flex-2 tw-overflow-auto tw-shadow-md tw-p-4">
        <h4 class="tw-mb-2">preview</h4>
        <div v-html="item.html"
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
import {inject, PropType, Ref} from "vue"
import {directive as vClickAway} from "vue3-click-away"
import {NonFunctionPropertyNames} from "../util/util"

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  showCloseButton: Boolean,
  editMode: Boolean
})
const emit = defineEmits(['delete', 'close', 'copy', 'edit-start', 'edit-end', 'change'])
const deleteElement = (): void => emit('delete')
const copyElement = (): void => emit('copy')
const close = (): void => emit('close')

const changeItem = (field: NonFunctionPropertyNames<Item>,
                    $event: Event | string) => {
  const value = typeof $event === 'string'
      ? $event
      : (<HTMLInputElement>$event.target).value

  emit('change', props.item.id, field, value)
}

const touchable = inject<Ref<boolean>>('touchable')
</script>

<style scoped lang="scss">

</style>