import ShortUniqueId from "short-unique-id"

const checkTouchable = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)

const generateUniqueId = (): string => new ShortUniqueId({
  length: 10,
  //HTML의 element에 id를 부여할 때, 맨 처음 숫자가 숫자면 에러
  dictionary: "alpha"
})()

export default {
  checkTouchable,
  generateUniqueId
}