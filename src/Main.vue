<template>
  <div class="padding-2">
    <UiStyle>{{ createCss('.dsm') }}</UiStyle>
    <div
        class="bg-gray padding-dot-5 display-flex gap-1 margin-bottom-1 position-sticky top-0 left-0 z-index-3">
      <button class="dsm-button padding-dot-5 box-shadow"
              :class="{active: !isShowAllCodes && listStyle === 'thumbnail'}"
              @click="setListStyle('thumbnail');toggleAllCode(false)">
        <span class="material-icons-outlined">widgets</span>
      </button>
      <button class="dsm-button padding-dot-5 box-shadow"
              :class="{active: !isShowAllCodes && listStyle === 'bullet'}"
              @click="setListStyle('bullet');toggleAllCode(false)">
        <span class="material-icons-outlined">format_list_bulleted</span>
      </button>
      <button class="dsm-button padding-dot-5 box-shadow"
              :class="{active: isShowAllCodes}"
              @click="toggleAllCode(!isShowAllCodes)">
        <span class="material-icons-outlined">code</span>
      </button>
      <button v-if="isShowSaveButton()"
              class="dsm-button padding-dot-5 box-shadow margin-left-auto"
              @click="postSave">
        <span class="material-icons-outlined">save</span>
      </button>
    </div>
    <AllCodes v-if="isShowAllCodes"
              :groups="groups"/>
    <template v-else>
      <ListStyleBullet v-if="listStyle === 'bullet'"
                       :groups="groups"
                       @delete="deleteElement"
                       @add="addElement"
                       @add-group="addGroup"/>
      <ListStyleThumbnail v-else
                          :groups="groups"
                          @delete="deleteElement"
                          @add="addElement"
                          @add-group="addGroup"
                          @drag="onDrag"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import UiStyle from "./components/UiStyle.vue"
import {Group, ItemDragEvent} from "./models/Item"
import ListStyleBullet from "./components/ListStyleBullet.vue"
import ListStyleThumbnail from "./components/ListStyleThumbnail.vue"
import AllCodes from "./components/AllCodes.vue"
import {ActionManager} from "./models/ActionManager"
import {AddAction, AddGroupAction, DragMovedAction, DragRemovedAction, RemoveAction} from "./models/BasicActions"

type ListType = 'thumbnail' | 'bullet'

const listStyle = ref<ListType>('thumbnail')
const setListStyle = (listType: ListType): void => {
  listStyle.value = listType
}
const groups = ref<Group[]>([
  {
    name: 'Background color',
    items: [
      {
        html: '<div class="bg-1"\n' +
            '    style="width:50px; height:50px;border-radius:50%;">\n' +
            '</div>',
        css: '.bg-1 {\n' +
            '    background: #13293D;\n' +
            '}',
        name: '#13293D',
        description: '',
      },
      {
        html: '<div class="bg-2"\n' +
            '    style="width:50px; height:50px;border-radius:50%;">\n' +
            '</div>',
        css: '.bg-2 {\n' +
            '    background: #006494;\n' +
            '}',
        name: '#006494',
        description: '',
      },
      {
        html: '<div class="bg-3"\n' +
            '    style="width:50px; height:50px;border-radius:50%;">\n' +
            '</div>',
        css: '.bg-3 {\n' +
            '    background: #247BA0;\n' +
            '}',
        name: '#247BA0',
        description: '',
      },
      {
        html: '<div class="bg-4"\n' +
            '    style="width:50px; height:50px;border-radius:50%;">\n' +
            '</div>',
        css: '.bg-4 {\n' +
            '    background: #1B98E0;\n' +
            '}',
        name: '#1B98E0',
        description: '',
      },
      {
        html: '<div class="bg-5"\n' +
            '    style="width:50px; height:50px;border-radius:50%;">\n' +
            '</div>',
        css: '.bg-5 {\n' +
            '    background:#E8F1F2;\n' +
            '}',
        name: '#E8F1F2',
        description: '',
      }
    ]
  },
  {
    name: 'Text color',
    items: [
      {
        html: '<h4 class="text-color-1">text<br/>#1B98E0</h4>',
        css: '.text-color-1 {\n    color:#1B98E0;\n  }',
        name: '#1B98E0',
        description: '',
      },
      {
        html: '<h4 class="text-color-2">text<br/>tomato</h4>',
        css: '.text-color-2 {\n    color:tomato;\n  }',
        name: 'tomato',
        description: '',
      },
      {
        html: '<h4 class="text-orange">text<br/>orange</h4>',
        css: '.text-orange {\n    color:orange;\n  }',
        name: 'orange',
        description: '',
      }
    ]
  },
  {
    name: 'Icon',
    items: [
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-arrow-left"></i>\n' +
            '</span>\n',
        css: '.icon-arrow-left {\n  background-color: currentColor;\n  -webkit-mask-image: url(https://api.iconify.design/ic/baseline-arrow-back-ios-new.svg);\n  mask-image: url(https://api.iconify.design/ic/baseline-arrow-back-ios-new.svg);\n  -webkit-mask-repeat: no-repeat;\n  mask-repeat: no-repeat;\n  -webkit-mask-size: 100% 100%;\n  mask-size: 100% 100%;\n}',
        name: 'Arrow left',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-arrow-right"></i>\n' +
            '</span>\n',
        css: '.icon-arrow-right {\n  background-color: currentColor;\n  -webkit-mask-image: url(https://api.iconify.design/ic/baseline-arrow-forward-ios.svg);\n  mask-image: url(https://api.iconify.design/ic/baseline-arrow-forward-ios.svg);\n  -webkit-mask-repeat: no-repeat;\n  mask-repeat: no-repeat;\n  -webkit-mask-size: 100% 100%;\n  mask-size: 100% 100%;\n}',
        name: 'Arrow right',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-arrow-bottom"></i>\n' +
            '</span>\n',
        css: '.icon-arrow-bottom {\n  -webkit-mask-image: url(https://api.iconify.design/ic/baseline-keyboard-arrow-down.svg);\n  mask-image: url(https://api.iconify.design/ic/baseline-keyboard-arrow-down.svg);\n}',
        name: 'Arrow bottom',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-arrow-top"></i>\n' +
            '</span>\n',
        css: '.icon-arrow-top {\n  -webkit-mask-image: url(https://api.iconify.design/ic/baseline-keyboard-arrow-up.svg);\n  mask-image: url(https://api.iconify.design/ic/baseline-keyboard-arrow-up.svg);\n}',
        name: 'Arrow top',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-bullet"></i>\n' +
            '</span>\n',
        css: '.icon-bullet {\n  -webkit-mask-image: url(https://api.iconify.design/zondicons/list-bullet.svg);\n  mask-image: url(https://api.iconify.design/zondicons/list-bullet.svg);\n}',
        name: 'Bullet',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-widgets"></i>\n' +
            '</span>\n',
        css: '.icon-widgets {\n  -webkit-mask-image: url(https://api.iconify.design/material-symbols/widgets-outline.svg);\n  mask-image: url(https://api.iconify.design/material-symbols/widgets-outline.svg);\n}',
        name: 'Widgets',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-code"></i>\n' +
            '</span>\n',
        css: '.icon-code {\n  -webkit-mask-image: url(https://api.iconify.design/material-symbols/code.svg);\n  mask-image: url(https://api.iconify.design/material-symbols/code.svg);\n}',
        name: 'Code',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-add"></i>\n' +
            '</span>\n',
        css: '.icon-add {\n  -webkit-mask-image: url(https://api.iconify.design/material-symbols/add-circle-outline.svg);\n  mask-image: url(https://api.iconify.design/material-symbols/add-circle-outline.svg);\n}',
        name: 'Add',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-delete"></i>\n' +
            '</span>\n',
        css: '.icon-delete {\n  -webkit-mask-image: url(https://api.iconify.design/material-symbols/delete-outline.svg);\n  mask-image: url(https://api.iconify.design/material-symbols/delete-outline.svg);\n}',
        name: 'Delete',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-heart-fill"></i>\n' +
            '</span>\n',
        css: '.icon-heart-fill {\n  -webkit-mask-image: url(https://api.iconify.design/mdi/cards-heart.svg);\n  mask-image: url(https://api.iconify.design/mdi/cards-heart.svg);\n}',
        name: 'Heart Fill',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-heart"></i>\n' +
            '</span>\n',
        css: '.icon-heart {\n  -webkit-mask-image: url(https://api.iconify.design/mdi/cards-heart-outline.svg);\n  mask-image: url(https://api.iconify.design/mdi/cards-heart-outline.svg);\n}',
        name: 'Heart',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-eye"></i>\n' +
            '</span>\n',
        css: '.icon-eye {\n  -webkit-mask-image: url(https://api.iconify.design/mdi/eye-outline.svg);\n  mask-image: url(https://api.iconify.design/mdi/eye-outline.svg);\n}',
        name: 'Heart',
        description: 'If wanna change icon image, get icon url from iconify'
      },
      {
        html: '<span style="font-size:2rem;">\n' +
            '    <i class="icon icon-eye-off"></i>\n' +
            '</span>\n',
        css: '.icon-eye-off {\n  -webkit-mask-image: url(https://api.iconify.design/mdi/eye-off-outline.svg);\n  mask-image: url(https://api.iconify.design/mdi/eye-off-outline.svg);\n}',
        name: 'Heart',
        description: 'If wanna change icon image, get icon url from iconify'
      },
    ]
  },
  {
    name: 'Typograph',
    items: [
      {
        html: '<h1 class="h1">h1</h1>',
        css: '.h1 {font-size: 5rem;}',
        name: 'Heading1',
        description: 'Font size for Heading1',
      },
      {
        html: '<h2 class="h2">h2</h2>',
        css: '.h2 {font-size: 3rem;}',
        name: 'Heading2',
        description: 'Font size for Heading2',
      },
      {
        html: '<h3 class="h3">h3</h3>',
        css: '.h3 {font-size: 2.4rem;}',
        name: 'Heading3',
        description: 'Font size for Heading3',
      },
      {
        html: '<h4 class="h4">h4</h4>',
        css: '.h4 {font-size: 2rem;}',
        name: 'Heading4',
        description: 'Font size for Heading4',
      },
      {
        html: '<h5 class="h5">h5</h5>',
        css: '.h5 {font-size: 1.6rem;}',
        name: 'Heading5',
        description: 'Font size for Heading5',
      },
      {
        html: '<h6 class="h6">h6</h6>',
        css: '.h6 {font-size: 1rem;}',
        name: 'Heading6',
        description: 'Font size for Heading6',
      },
      {
        html: '<p class="p">p</p>',
        css: '.p {font-size: 1rem;}',
        name: 'Paragraph',
        description: 'Font size for Paragraph',
      },
    ]
  },
  {
    name: 'Button',
    items: [
      {
        html: '<button class="button">Button</button>',
        css: '.button {\n' +
            '    padding:4px 12px;\n' +
            '    border:1px solid #ccc;\n' +
            '    transition:background 200ms ease;\n' +
            '}\n' +
            '\n' +
            '.button:hover {\n' +
            '    background:rgba(0,0,0,.1);\n' +
            '}',
        name: 'Button',
        description: 'Button style for button component',
      },
      {
        html: '<button class="button" disabled>Button</button>',
        css: '.button[disabled] {\n  color:rgba(0,0,0,.3);\n}',
        name: 'Button disabled',
        description: 'Disabled button style for button component',
      }]
  },
  {
    name: 'Card',
    items: [
      {
        html: '<div class="card">\n' +
            '    <figure>\n' +
            '        <img src="https://dummyimage.com/500x500/eeeeee/000000.png"/>\n' +
            '    </figure>\n' +
            '    <div class="info">\n' +
            '        <h4>title</h4>\n' +
            '        <p>description</p>\n' +
            '    </div>\n' +
            '</div>',
        css: '.card {\n' +
            '    box-shadow:0 2px 5px #ccc;\n' +
            '    width:300px;\n' +
            '}\n' +
            '\n' +
            '.card img {\n' +
            '    width:100%;\n' +
            '    aspect-ratio:1;\n' +
            '    border-bottom:1px solid #ccc;\n' +
            '}\n' +
            '\n' +
            '.card .info {\n' +
            '    padding:12px;\n' +
            '}',
        name: 'Card',
        description: 'Card style for card component',
      }
    ]
  }
])
const actionManager = new ActionManager(groups.value)
window.addEventListener('keydown', ($event: KeyboardEvent) => {
  if ($event.key.toLowerCase() === 'z'
      && ($event.ctrlKey || $event.metaKey))
    $event.shiftKey
        ? actionManager.executeRedo()
        : actionManager.executeUndo()
})

const addGroup = () => actionManager.execute(AddGroupAction.of())

const addElement = (groupIndex: number) => actionManager.execute(AddAction.of(groupIndex))
const deleteElement = (groupIndex: number, rowIndex: number) => actionManager.execute(RemoveAction.of(groupIndex, rowIndex))

const isShowAllCodes = ref(false)
const toggleAllCode = (value: boolean) => {
  isShowAllCodes.value = value
}
const dragData = {
  fromGroupIndex: 0,
  fromItemIndex: 0,
  toGroupIndex: 0,
  toItemIndex: 0
}

const onDrag = (groupIndex: number, event: ItemDragEvent) => {
  if (event.moved) {
    actionManager.execute(DragMovedAction.of(groupIndex, Number(event.moved.newIndex), Number(event.moved.oldIndex)))
  } else if (event.added) {
    dragData.toGroupIndex = groupIndex
    dragData.toItemIndex = Number(event.added?.newIndex)
  } else if (event.removed) {
    dragData.fromGroupIndex = groupIndex
    dragData.fromItemIndex = Number(event.removed.oldIndex)

    actionManager.execute(DragRemovedAction.of(JSON.parse(JSON.stringify(dragData))))
  }
}

const createCss = (parentClass?: string) => groups.value
    .map((group) => group.items)
    .flat()
    .reduce((acc, current) => current?.css
        ? acc + current.css
        : acc, '')
    .replace(/\n|\r|\t/gi, '')
    .replace(/  /gi, '')
    .replace(/\..*?{/gmi, (i) => i.includes('url')
        ? i.replace(/}\..*?{/gmi, (s) => `${parentClass} ` + s)
        : `${parentClass} ` + i)

const isShowSaveButton = () => location.search.includes('save=true')

const postSave = () => window.parent.postMessage(createCss(), '*')

const onMessage = () => (event: MessageEvent) => {
  if (event.data.type === 'loadElements')
    groups.value = event.data.groups
}

window.addEventListener('message', onMessage())
</script>

<style scoped lang="scss">
</style>
