<template>
  <div class="tw-bg-white tw-p-4 tw-shadow-md tw-relative">
    <div class="tw-sticky tw-pt-4 tw-ml-auto tw-top-20 tw-h-0 tw-flex tw-items-center tw-justify-end tw-w-full tw-gap-2">
      <button class="tw-border tw-border-solid tw-border-slate-200 tw-bg-white tw-block tw-rounded-full tw-p-2 tw-h-fit tw-shadow-md"
              @click="download()">
        <span class="tw-text-xl dsm-icon dsm-icon-download"></span>
      </button>
      <button v-if="checkAllowedClipboard()"
              class="tw-border tw-border-solid tw-border-slate-200 tw-bg-white tw-block tw-rounded-full tw-p-2 tw-h-fit tw-shadow-md"
              @click="copyToClipboard()">
        <span class="tw-text-xl dsm-icon dsm-icon-copy"></span>
      </button>
    </div>
    <textarea class="tw-outline-0 tw-w-full tw-h-fit tw-m-0 tw-p-0 tw-border-0"
              readonly
              :value="cssValue"
              :style="{height: `${calcHeight(cssValue)}px`}"></textarea>
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType} from "vue"
import {Group} from "../models/Item"

const props = defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    required: true
  }
})

const essentialIconStyle = `.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
}`

const copyToClipboard = () => navigator.clipboard.writeText(cssValue.value)

const checkAllowedClipboard = () => !!navigator?.clipboard?.writeText

const cssValue = computed(() => props.groups
    .map((group) => group.items)
    .flat()
    .reduce((acc, current) => {
      const newline = acc ? '\n\n' : ''
      return acc + newline + current.css
    }, essentialIconStyle))

const calcHeight = (value: string) => {
  const numberOfLineBreaks = (value.match(/\n/g) || []).length
  return numberOfLineBreaks * 15.2;
}

const download = () => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cssValue.value));
  element.setAttribute('download', 'style.css')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

</script>

<style scoped lang="scss">

</style>