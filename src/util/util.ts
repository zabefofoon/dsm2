const checkTouchable = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)

export default {
  checkTouchable
}