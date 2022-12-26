<template>
  <div class="bg-white box-shadow padding-2"
       v-click-away="() => close()">
    <div class="display-flex gap-1 margin-bottom-1">
      <button class="dsm-button padding-dot-5 box-shadow"
              @click="deleteElement">
        <span class="material-icons-outlined">delete</span>
      </button>
      <button v-if="showCloseButton"
              class="dsm-button padding-dot-5 box-shadow"
              @click="close">
        <span class="material-icons-outlined">close</span>
      </button>
    </div>
    <div class="margin-bottom-3">
      <input class="width-100per padding-dot-5 margin-bottom-1"
             type="text"
             placeholder="name"
             v-model="item.name"/>
      <input class="width-100per padding-dot-5"
             placeholder="description"
             v-model="item.description"/>
    </div>
    <div class="display-flex gap-1">
      <div class="flex-1 over-flow-auto box-shadow padding-2">
        <h4 class="margin-bottom-1">html</h4>
        <codemirror v-model="item.html"
                    placeholder="Html goes here..."
                    :style="{ height: 'fit-content', fontSize: '.9rem' }"
                    :tab-size="4"
                    :extensions="[html()]"/>
      </div>
      <div class="flex-1 over-flow-auto box-shadow padding-2">
        <h4 class="margin-bottom-1">css</h4>
        <codemirror v-model="item.css"
                    placeholder="Css goes here..."
                    :style="{ height: 'fit-content', fontSize: '.9rem' }"
                    :tab-size="4"
                    :extensions="[css()]"/>
      </div>
      <div class="flex-2 over-flow-auto box-shadow padding-2">
        <h4 class="margin-bottom-1">preview</h4>
        <div v-html="item.html"></div>
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
  item: Object as PropType<Item>,
  showCloseButton: Boolean
})
const emit = defineEmits(['delete', 'close'])
const deleteElement = (): void => emit('delete')
const close = (): void => emit('close')
</script>

<style scoped lang="scss">

</style>