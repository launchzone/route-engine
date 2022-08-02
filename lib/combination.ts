/**
 * @description catesian product of multiple arrays
 */
export const makeTupleCombination = <T>(...a: T[][]): T[][] =>
  // @ts-ignore
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))
