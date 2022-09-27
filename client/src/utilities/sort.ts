export const fn = (a: string | number, b: string | number) => {
  return a < b ? -1 : a > b ? 1 : 0
}

// export default <T>(array: T[]) => {
//   let new_array = [...array]
//   return new_array.sort((a, b) => fn(a, b))
// }
