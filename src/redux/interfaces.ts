import { statsTypes, weaponTypes } from '@data/randomData'

export type PerkTypes =
   | 'armorExotic'
   | 'weaponPerkExotic'
   | 'weaponFrameExotic'
   | 'weaponCatalystExotic'
   //---------
   | 'weaponPerk'
   | 'weaponPerkEnhanced'
   | 'weaponOriginTrait'
   | 'weaponFrame'
   //---------
   | 'fragment'
   | 'aspect'
   | 'super'
   | 'grenade'
   | 'melee'
   | 'class'
   | 'movement'
   //---------
   | 'armorModGeneral'
   | 'armorModCombat'
   | 'armorModActivity'
   | 'armorModSeasonal'
   | 'weaponMod'
   | 'ghostMod'
   | 'artifactMod'
   //---------
   | 'none'

export type StatNames = typeof statsTypes[number]

export type WeaponTypes = typeof weaponTypes[number]

export type Languages =
   /** English - English */
   | 'en'
   /** German - Deutsch */
   | 'de'
   /** French - Français */
   | 'fr'
   /** Italian - Italiano */
   | 'it'
   /** Polish - Polski */
   | 'pl'
   /** Russian - Русский */
   | 'ru'
   /** Spanish (Spain) - Español (España) */
   | 'es'
   /** Spanish (Mexico) - Español (México) */
   | 'es-mx'
   /** Korean - 한국어 */
   | 'ko'
   /** Portuguese (Brazil) - Português (Brasil) */
   | 'pt-rb'
   /** Japanese - 日本語 */
   | 'ja'
   /** Chinese (Traditional) - 繁體中文 */
   | 'zh-cht'
   /** Chinese (Simplified) - 简体中文 */
   | 'zh-chs'

export interface Stat {
   weaponTypes?: WeaponTypes[]
   active?: {
      multiplier?: number[]
      stat?: number[]
   }
   passive?: {
      multiplier?: number[]
      stat?: number[]
   }
}
export type Stats = {
   [key in StatNames]?: Stat[]
}

export interface Perk {
   hash: number
   name: string
   itemHash?: number
   itemName?: string
   uploadedBy: string
   type: PerkTypes
   importStatsFrom?: number
   linkedWith?: number | undefined
   updateTracker: {
      stats?: {
         lastUpdate: number
         updatedBy: string
      }
      descriptions: {
         [key in Languages]?: {
            lastUpdate: number
            updatedBy: string
         }
      }
   }
   editor: {
      [key in Languages]?: {
         main: string
         secondary: string
      }
   }
   stats?: Stats
   investmentStats?: {
      statTypeHash: number
      value: number
      isConditionallyActive: boolean
   }[]
   lastUpload: number
   inLiveDatabase: boolean
   optional: boolean
   hidden: boolean
   uploadToLive: boolean
}

export interface Database {
   [key: string]: Perk
}

export interface SettingsState {
   currentlySelected: number
   language: Languages
   selectedType: PerkTypes
   displayHiddenPerks: boolean
   editorType: 'normal' | 'dual' | 'multilanguage'
   newPerkWindow: boolean
   messages: {
      message: string
      type?: 'error' | 'success'
   }[]
   weaponType: WeaponTypes
   globalUploadToLive: boolean
}

export interface OriginalDatabase {
   /** Only mutated after upload to live database used for comparison only */
   live: Database
   /** Only mutated after upload to intermediate database used for comparison only */
   intermediate: Database
}

export interface GlobalState {
   database: Database
   settings: SettingsState
   originalDatabase: OriginalDatabase
}

export interface LivePerk {
   hash: number
   name: string
   itemHash?: number
   itemName?: string
   uploadedBy?: string
   type: PerkTypes
   updateTracker?: {
      stats?: {
         lastUpdate: number
         updatedBy: string
      }
      descriptions: {
         [key in Languages]?: {
            lastUpdate: number
            updatedBy: string
         }
      }
   }
   descriptions: {
      [key in Languages]?: any
   }
   stats?: Stats
}
