import { Stat, StatNames, Stats, WeaponTypes } from '@icemourne/description-converter'

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
   weaponTypes: WeaponTypes[]
}

export type StringStats = {
   [key in StatNames]: StringStat[]
}

export function statsToString(stats: Stats = {}) {
   return Object.entries(stats).reduce((acc, [key, stat]: [string, Stat[]]) => {
      acc[key as StatNames] = stat.map((value) => {
         return {
            passive: {
               stat: value?.passive?.stat?.join(', ') || '',
               multiplier: value?.passive?.multiplier?.join(', ') || ''
            },
            active: {
               stat: value?.active?.stat?.join(', ') || '',
               multiplier: value?.active?.multiplier?.join(', ') || ''
            },
            weaponTypes: value?.weaponTypes || []
         }
      })
      return acc
   }, {} as StringStats)
}
