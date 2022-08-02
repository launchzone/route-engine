export const tryCatch = <T>(fn: () => T): [null, T] | [Error, null] => {
  try {
    return [null, fn()]
  } catch (e) {
    return [e, null]
  }
}
