/**
 ** Combines class names in to single string usable by react
 ** If boolean is provided as argument second argument will be added depending on booleans value
 */
export function cnc(...arr: (string | boolean | undefined)[]) {
   let newClassName = ''
   let indexToSkip = -1
   for (let i = 0; i < arr.length; i++) {
      if (indexToSkip === i) continue
      const value = arr[i]
      const nextValue = arr[i + 1]
      if (typeof value === 'string') {
         newClassName += ` ${value}`
         continue
      }
      value ? (newClassName += ` ${nextValue}`) : ''
      indexToSkip = i + 1
   }
   return newClassName.trim()
}
