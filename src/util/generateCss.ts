import {Group} from "../models/Item"

export const DEFAULT_CSS = `
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
}
`

export const generateCss = (groups: Group[]) => groups
    .map((group) => group.items)
    .flat()
    .reduce((acc, current) => current?.css
        ? acc + current.css
        : acc, DEFAULT_CSS)
