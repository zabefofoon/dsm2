<template>
  <VueFinalModal v-slot="{ params, close }"
                 v-bind="$attrs"
                 classes="modal-container"
                 content-class="modal-content w-4/5"
                 :lock-scroll="false"
                 :click-to-close="false">
    <span class="modal__title">
    </span>
    <div class="modal__content">
      <div class="tw-py-5">
        <div class="tw-mb-5">
          <input class="tw-w-full tw-p-2 tw-mb-2 tw-border tw-border-0 tw-border-b tw-border-slate-300"
                 type="text"
                 placeholder="name"
                 v-model="dataForEmit.name"
                 :readonly="!editMode"
                 @focusin="emit('edit-start')"
                 @focusout="emit('edit-end')"/>
          <input class="tw-w-full tw-p-2 tw-border tw-border-0 tw-border-b tw-border-slate-300"
                 placeholder="description"
                 v-model="dataForEmit.description"
                 :readonly="!editMode"
                 @focusin="emit('edit-start')"
                 @focusout="emit('edit-end')"/>
        </div>
        <div class="tw-flex">
          <button class="tw-w-full tw-py-2"
                  :class="{active: tabMode === 'Html'}"
                  @click="changeTabMode('Html')">Html
          </button>
          <button class="tw-w-full tw-py-2"
                  :class="{active: tabMode === 'Css'}"
                  @click="changeTabMode('Css')">Css
          </button>
          <button class="tw-w-full tw-py-2"
                  :class="{active: tabMode === 'Preview'}"
                  @click="changeTabMode('Preview')">Preview
          </button>
        </div>
        <div class="flex tw-gap-1 tw-min-h-[200px]">
          <div v-if="tabMode === 'Html'"
               class="tw-flex-1 tw-overflow-auto tw-shadow-md tw-p-4">
            <codemirror v-model="dataForEmit.html"
                        placeholder="Html goes here..."
                        :style="{ height: 'fit-content',
                               fontSize: '.9rem' }"
                        :tab-size="4"
                        :extensions="[html()]"
                        @focusin="emit('edit-start')"
                        @focusout="emit('edit-end')"/>
          </div>
          <div v-if="tabMode === 'Css'"
               class="tw-flex-1 tw-overflow-auto tw-shadow-md tw-p-4">
            <codemirror v-model="dataForEmit.css"
                        placeholder="Css goes here..."
                        :style="{ height: 'fit-content',
                               fontSize: '.9rem' }"
                        :tab-size="4"
                        :extensions="[css()]"
                        @focusin="emit('edit-start')"
                        @focusout="emit('edit-end')"/>
          </div>
          <div v-if="tabMode === 'Preview'"
               class="dsm tw-flex-2 tw-overflow-auto tw-shadow-md">
            <div v-html="dataForEmit.html"
                 @focusin="emit('edit-start')"
                 @focusout="emit('edit-end')"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal__action">
      <button class="tw-text-white tw-w-full tw-py-2"
              style="background: #1B98E0"
              @click="done(close)">
        Done
      </button>
      <button class="tw-w-full tw-py-2"
              @click="close()">
        Cancel
      </button>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import {VueFinalModal} from 'vue-final-modal'
import {Item} from "../models/Item"
import {ref} from "vue"
import {Codemirror} from 'vue-codemirror'
import {html} from "@codemirror/lang-html"
import {css} from "@codemirror/lang-css"

const props = defineProps({
  item: Item,
  editMode: Boolean
})

const emit = defineEmits(['done', 'edit-end', 'edit-start'])

const dataForEmit = ref({
  name: props.item?.name,
  description: props.item?.name,
  html: props.item?.html,
  css: props.item?.css
})

const done = (close: () => void) => {
  emit('done', dataForEmit.value)
  close()
}


const tabMode = ref<'Html' | 'Css' | 'Preview'>('Html')
const changeTabMode = (value: 'Html' | 'Css' | 'Preview') => {
  tabMode.value = value
}
</script>
<style scoped lang="scss">
.active {
  background: #1B98E0;
  color: white;
}
</style>