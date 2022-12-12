import _ from 'lodash'

export function cleanObject<T>(dirtyObject: T): T {
   const obj = _.cloneDeep(dirtyObject)
   const remover = (obj: any) => {
      for (const key in obj) {
         // remove null undefined
         if (obj[key] === undefined) delete obj[key]
         if (obj[key] === null ) delete obj[key]
         if (Number.isNaN(obj[key])) delete obj[key]
         // remove empty strings
         // if where is reason to remove empty strings don't remove from object with key 'text'
         // if (typeof obj[key] === 'string' && obj[key].trim() === '') delete obj[key]
         if (!obj[key] || typeof obj[key] !== 'object') continue
         remover(obj[key])
         if (Object.keys(obj[key]).length === 0) delete obj[key]
      }
      return obj
   }
   const nuke = (key: string, value: any) => {
      if (Array.isArray(value)) {
         return _.compact(value)
      }
      return value
   }

   return JSON.parse(JSON.stringify(remover(obj), nuke))
}