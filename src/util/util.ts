import ShortUniqueId from "short-unique-id"

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
export type PartialNonFunctionProperties<T> = Partial<NonFunctionProperties<T>>;

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