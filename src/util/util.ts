import ShortUniqueId from "short-unique-id"

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export const generateUniqueId = (): string => new ShortUniqueId({
  length: 10,
  //HTML의 element에 id를 부여할 때, 맨 처음 숫자가 숫자면 에러
  dictionary: "alpha"
})()

export const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value))