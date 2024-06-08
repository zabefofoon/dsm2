<template>
  <VueFinalModal
    v-bind="$attrs"
    class="modal-container tw-w-full"
    content-class="modal-content tw-w-4/5"
    :lock-scroll="false"
    :click-to-close="false">
    <UiStyle> .modal-content { {{ dataForEmit.css }} } </UiStyle>
    <span class="modal__title"></span>
    <div class="modal__content">
      <div class="tw-py-5">
        <div class="tw-mb-5">
          <input
            v-model="dataForEmit.name"
            class="tw-w-full tw-p-2 tw-mb-2 tw-border-0 tw-border-b tw-border-slate-300"
            type="text"
            placeholder="name"
            :readonly="!editMode" />
          <input
            v-model="dataForEmit.description"
            class="tw-w-full tw-p-2 tw-border-0 tw-border-b tw-border-slate-300"
            placeholder="description"
            :readonly="!editMode" />
        </div>
        <div class="tw-flex tw-gap-1 tw-min-h-[200px]">
          <div class="tw-overflow-auto tw-w-full">
            <div
              class="tw-bg-slate-500 tw-text-white tw-text-center tw-text-[.9rem] | tw-px-2 tw-py-0.5">
              HTML
            </div>
            <codemirror
              v-model="dataForEmit.html"
              class="tw-h-fit text-[.9rem]"
              placeholder="Html goes here..."
              :tab-size="4"
              :extensions="[html()]"
              @keydown.stop />
          </div>
          <div class="tw-overflow-auto tw-w-full">
            <div
              class="tw-bg-slate-500 tw-text-white tw-text-center tw-text-[.9rem] | tw-px-2 tw-py-0.5">
              CSS
            </div>
            <codemirror
              v-model="dataForEmit.css"
              placeholder="Css goes here..."
              class="tw-h-fit text-[.9rem]"
              :tab-size="4"
              :extensions="[css()]"
              @keydown.stop />
          </div>
          <div class="tw-overflow-auto tw-w-full">
            <div
              class="tw-bg-slate-500 tw-text-white tw-text-center tw-text-[.9rem] | tw-px-2 tw-py-0.5">
              PREVIEW
            </div>
            <div v-html="dataForEmit.html"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal__action">
      <div class="tw-flex">
        <button
          class="tw-w-full tw-py-1.5 tw-px-8 tw-border"
          @click="emit('cancel')">
          Cancel
        </button>
        <button
          class="tw-text-white tw-w-full tw-py-1.5 tw-px-8"
          style="background: #1b98e0"
          @click="emit('done', dataForEmit)">
          Done
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { VueFinalModal } from 'vue-final-modal'
import { Item } from '../models/Item'
import UiStyle from './UiStyle.vue'

const props = defineProps<{
  item?: Item
  editMode?: boolean
}>()

const emit = defineEmits<{
  (e: 'done', item: Partial<Item>): void
  (e: 'cancel'): void
}>()

const dataForEmit = ref<Partial<Item>>({
  name: props.item?.name,
  description: props.item?.description,
  html: props.item?.html,
  css: props.item?.css,
  id: props.item?.id
})
</script>
<style scoped lang="scss">
.active {
  background: #1b98e0;
  color: white;
}
</style>
