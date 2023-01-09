import { Database, Languages, PerkTypes, WeaponTypes } from '@icemourne/description-converter'
import { InventoryItems, Stats } from '@icemourne/tool-box'
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
   bungie: {
      inventoryItem: InventoryItems | undefined
      stat: Stats | undefined
   }
}
