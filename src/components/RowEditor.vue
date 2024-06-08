<template>
  <div
    v-click-away="() => !touchable && close()"
    class="tw-bg-white tw-shadow-md tw-p-4"
    tabindex="0"
    @keydown.stop>
    <div class="tw-flex tw-gap-1 tw-mb-4">
      <button
        v-if="editMode"
        class="tw-bg-white tw-border tw-border-solid tw-border-slate-200 tw-rounded-full tw-p-1 tw-h-fit tw-shadow-md"
        @click="copyElement">
        <span class="tw-text-lg dsm-icon dsm-icon-copy"></span>
      </button>
      <button
        v-if="editMode"
        class="tw-bg-white tw-border tw-border-solid tw-border-slate-200 tw-rounded-full tw-p-1 tw-h-fit tw-shadow-md"
        @click="deleteElement">
        <span class="tw-text-lg dsm-icon dsm-icon-delete"></span>
      </button>
      <button
        v-if="showCloseButton"
        class="tw-bg-white tw-border tw-border-solid tw-border-slate-200 tw-rounded-full tw-p-1 tw-h-fit tw-shadow-md"
        @click="close">
        <span class="tw-text-lg dsm-icon dsm-icon-close"></span>
      </button>
    </div>
    <div class="tw-mb-4">
      <input
        class="tw-w-full tw-p-2 tw-mb-2 tw-border tw-border-0 tw-border-b tw-border-slate-300"
        type="text"
        placeholder="name"
        :value="item.name"
        :readonly="!editMode"
        @change="changeItem('name', $event)"
        @focusin="$emit('edit-start')"
        @focusout="$emit('edit-end')" />
      <input
        class="tw-w-full tw-p-2 tw-border tw-border-0 tw-border-b tw-border-slate-300"
        placeholder="description"
        :value="item.description"
        :readonly="!editMode"
        @change="changeItem('description', $event)"
        @focusin="$emit('edit-start')"
        @focusout="$emit('edit-end')" />
    </div>
    <div class="tw-flex tw-gap-1">
      <div class="tw-flex-1 tw-overflow-auto tw-shadow-md tw-p-4">
        <h4 class="tw-mb-2">html</h4>
        <div class="tw-max-h-96">
          <codemirror
            :model-value="item.html"
            placeholder="Html goes here..."
            :style="{ height: 'fit-content', fontSize: '.9rem' }"
            :tab-size="4"
            :extensions="[html()]"
            @change="changeItem('html', $event)"
            @focusin="$emit('edit-start')"
            @focusout="$emit('edit-end')" />
        </div>
      </div>
      <div class="tw-flex-1 tw-overflow-auto tw-shadow-md tw-p-4">
        <h4 class="tw-mb-2">css</h4>
        <div class="tw-max-h-96">
          <codemirror
            :model-value="item.css"
            placeholder="Css goes here..."
            :style="{ height: 'fit-content', fontSize: '.9rem' }"
            :tab-size="4"
            :extensions="[css()]"
            @change="changeItem('css', $event)"
            @focusin="$emit('edit-start')"
            @focusout="$emit('edit-end')" />
        </div>
      </div>
      <div class="dsm tw-flex-2 tw-overflow-auto tw-shadow-md tw-p-4">
        <h4 class="tw-mb-2">preview</h4>
        <div
          @focusin="$emit('edit-start')"
          @focusout="$emit('edit-end')"
          v-html="item.html"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { inject, type Ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { directive as vClickAway } from 'vue3-click-away'
import { Item } from '../models/Item'
import type { NonFunctionPropertyNames } from '../util/util'

const props = defineProps<{
  item: Item
  showCloseButton: boolean
  editMode: boolean
}>()
const emit = defineEmits([
  'delete',
  'close',
  'copy',
  'edit-start',
  'edit-end',
  'change'
])
const deleteElement = (): void => emit('delete')
const copyElement = (): void => emit('copy')
const close = (): void => emit('close')

const changeItem = (
  field: NonFunctionPropertyNames<Item>,
  $event: Event | string
) => {
  const value =
    typeof $event === 'string'
      ? $event
      : (<HTMLInputElement>$event.target).value

  emit('change', props.item.id, field, value)
}

const touchable = inject<Ref<boolean>>('touchable')
</script>

<style scoped lang="scss"></style>
