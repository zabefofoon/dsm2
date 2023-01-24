<template>
  <div class="bg-white p-4 shadow-md relative">
    <div class="sticky ml-auto top-20 h-0">
      <button v-if="checkAllowedClipboard()"
              class="dsm-button bg-white block rounded-full p-2 h-fit shadow-md ml-auto"
              @click="copyToClipboard()">
        <span class="text-xl icon icon-copy">content_copy</span>
      </button>
    </div>
    <textarea class="outline-0 w-full h-fit m-0 p-0 border-0"
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
</script>

<style scoped lang="scss">

</style>