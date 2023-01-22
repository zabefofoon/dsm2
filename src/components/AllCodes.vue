<template>
  <div class="bg-white p-4 shadow-md relative">
    <div class="sticky ml-auto top-20 h-0">
      <button v-if="checkAllowedClipboard()"
              class="block rounded-full p-2 h-fit shadow-md ml-auto"
              @click="copyToClipboard()">
        <span class="text-xl icon icon-copy">content_copy</span>
      </button>
    </div>
    <div v-html="escapeToBr(essentialIconStyle)"></div>
    <div v-for="(item, index) in groups.map((group) => group.items).flat()"
         :key="index"
         class="css-block"
         v-html="escapeToBr(item.css)">
    </div>

  </div>
</template>

<script lang="ts" setup>
import {PropType} from "vue"
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

const escapeToBr = (str: string): string => str
    .replace(/\n/gi, '<br/>')
    .replace(/\t/gi, '&nbsp;&nbsp;&nbsp;&nbsp;')

const copyToClipboard = () => {
  const css = props.groups
      .map((group) => group.items)
      .flat()
      .reduce((acc, current) => current.css
          ? acc + current.css
          : acc, '')
      .replace(/\n|\t/gi, '')
      .replaceAll(/    /gi, '')
  navigator.clipboard.writeText(css)
}

const checkAllowedClipboard = () => !!navigator?.clipboard?.writeText

</script>

<style scoped lang="scss">
.css-block {
  margin-top: 2rem;

  &:nth-child(2) {
    margin-top: 0;
  }
}
</style>