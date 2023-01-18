import { Stat, StatNames, Stats, WeaponTypes, weaponTypes } from '@icemourne/description-converter'

import { TypedObject } from '@icemourne/tool-box'

export function statsStringToArray(str: string): number[] {
   const statsArr = str.split(',')
   return statsArr.flatMap((stat) => {
      const cleanStat = stat.trim().match(/\d+\.\d+|\d+/)?.[0]
      if (cleanStat) return Number(stat)
      return []
   })
}

export type StringStat = {
   passive: {
      stat: string
      multiplier: string
   }
   active: {
      stat: string
      multiplier: string
   }
   /**
    * [weaponType, isUsed]
    */
   weaponTypes: [WeaponTypes, boolean][]
}

export type StringStats = {
   [key in StatNames]: StringStat[]
}

export function statsToString(stats: Stats = {}) {
   return Object.entries(stats).reduce((acc, [key, stat]: [string, Stat[]]) => {
      const weaponTypesState = weaponTypes.map((weaponType) => [weaponType, false]) as [WeaponTypes, boolean][]

      acc[key as StatNames] = stat.map((value) => {
         value?.weaponTypes?.forEach((weaponType) => {
            const index = weaponTypesState.findIndex(([type]) => type === weaponType)
            weaponTypesState[index][1] = true
         })

         return {
            passive: {
               stat: value?.passive?.stat?.join(', ') || '',
               multiplier: value?.passive?.multiplier?.join(', ') || ''
            },
            active: {
               stat: value?.active?.stat?.join(', ') || '',
               multiplier: value?.active?.multiplier?.join(', ') || ''
            },
            weaponTypes: weaponTypesState
         }
      })
      return acc
   }, {} as StringStats)
}
