import ''

// If you see "Optional" then it is optional and probably not included by default
// If something is not clear just ask if you think you can improve explanation make PR

/**
 ** Perk types are not same us Bungie's
 */
type PerkTypes =
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

/**
 ** Stats names are not same us Bungie's
 */
type StatNames =
   | 'range'
   | 'reload'
   | 'handling'
   | 'stability'
   | 'zoom'
   | 'aimAssist'
   | 'chargeDraw'
   | 'fireRate'
   | 'ready'
   | 'stow'
   | 'damage'
   | 'airborne'

/**
 ** Weapon types are not same us Bungie's
 */
type WeaponTypes =
   | 'auto rifle'
   | 'combat bow'
   | 'fusion rifle'
   | 'glaive'
   | 'grenade launcher'
   | 'hand cannon'
   | 'heavy grenade launcher'
   | 'linear fusion rifle'
   | 'machine gun'
   | 'pulse rifle'
   | 'rocket launcher'
   | 'scout rifle'
   | 'shotgun'
   | 'sidearm'
   | 'sniper rifle'
   | 'submachine gun'
   | 'sword'
   | 'trace rifle'
   //---------
   | 'super'
   | 'grenade'
   | 'melee'

/**
 ** Languages are same us Bungie's
 */
type Languages =
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

interface Stat {
   /**
    ** Weapon type stats are for
    ** This is not bungie weapon types
    ** Optional
    */
   weaponTypes?: WeaponTypes[]

   /**
    ** Stats active with some condition like kill
    ** Stat Array index is key for formulas in perk descriptions
    */
   active?: {
      /**
       ** Calculated stat * multiplier
       */
      multiplier?: number[]

      /**
       ** Bungie stat + stat
       */
      stat?: number[]
   }

   /**
    ** Stats active all the time this dose not include investment stats from bungie
    */
   passive?: {
      /**
       ** Calculated stat * multiplier
       */
      multiplier?: number[]

      /**
       ** Bungie stat + stat
       */
      stat?: number[]
   }
}

type Stats = {
   /**
    ** Stats names are not same us Bungie's
    */
   [key in StatNames]?: Stat[]
}

interface LinesContent {
   /**
    ** Text in this part of the line
    */
   text?: string

   /**
    ** Class names of this parts of the line
    */
   classNames?: (string | undefined)[]

   /**
    * If this line has URL then this line and its text is part of link
    */
   link?: string

   /**
    ** If this line has formula then this line and its text is part of formula
    */
   formula?: string

   /**
    ** If this line has title then this line and its text is part of title
    */
   title?: DescriptionLine[]
}

interface CellContent {
   /**
    ** Text in this part of the cell \<span>
    */
   text?: string

   /**
    ** this will be moved from hare when converting description
    */
   classNames?: (string | undefined)[]

   /**
    * If this part of cell \<span> has URL then this part of the cell \<span> and its text is part of link
    */
   link?: string

   /**
    * If this part of cell \<span> has formula then this part of the cell \<span> and its text is part of formula
    */
   formula?: string

   /**
    ** If this part of cell \<span> has title then this part of the cell \<span> and its text is part of title
    */
   title?: DescriptionLine[]

   /**
    ** this will be moved from hare when converting description
    */
   colSpan?: number

   /**
    * this will be moved from hare when converting description
    */
   rowSpan?: number

   /**
    ** this will be moved from hare when converting description
    */
   cellClassNames?: (string | undefined)[]
}

/**
 ** Contents of table row \<tr> aka array of cells
 */
interface RowContent {
   /**
    ** Contents of cell \<td> aka array of spans \<span>
    */
   cellContent: CellContent[]

   /**
    ** Number of cell to span horizontally
    */
   colSpan?: number

   /**
    ** Number of cell to span vertically
    */
   rowSpan?: number

   /**
    ** this will be moved from hare when converting description
    */ //todo fix explanation
   classNames?: (string | undefined)[]
}

interface TableLine {
   /**
    ** Contents of table row \<tr> aka array of cells
    */
   rowContent?: RowContent[]

   /**
    ** row \<tr> classNames
    */
   classNames?: (string | undefined)[]
}

interface DescriptionLine {
   /**
    ** Lines \<div> class names
    */
   classNames?: (string | undefined)[]

   /**
    ** Contents of line \<span>
    */
   linesContent?: LinesContent[]

   /**
    ** Is table content only formulas
    */
   isFormula?: boolean | undefined

   /**
    * Contents of table \<table>
    */
   table?: TableLine[]

   /**
    ** If this exists that means this line only applies to some specific weapon types
    */
   weaponTypes?: (string | undefined)[]
}

interface Perk {
   /**
    ** Inventory item hash
    */
   hash: number

   /**
    ** Inventory item display properties name
    */
   name: string

   /**
    ** Inventory item hash
    */
   itemHash?: number

   /**
    ** Inventory item display properties name
    */
   itemName?: string

   /**
    ** Nickname of person who uploaded this perk
    ** Optional
    */
   uploadedBy: string

   /**
    ** Type of the perk
    ** Optional
    */
   type: PerkTypes

   /**
    ** Date in ms then it was changed
    ** Optional
    */
   updateTracker: {
      /**
       ** Date in ms then stats changed
       ** Optional
       ** Stats have to be enabled for this to show up
       ** Shows up on all perks regardless if they have stats or don't
       */
      stats: {
         /**
          ** Date in ms then stats changed
          */
         lastUpdate: number

         /**
          ** Name of person who updated stats
          */
         updatedBy: string
      }
      descriptions: {
         /**
          ** Languages are same us bungie's
          */
         [key in Languages]?: {
            /**
             ** Date in ms then description changed
             */
            lastUpdate: number

            /**
             ** Name of person who updated description
             */
            updatedBy: string
         }
      }
   }
   descriptions: {
      /**
       ** Descriptions can be converted to custom string // code for that is already made
       ** Or it can be converted to something custom
       ** Languages are same us bungie's
       */
      [key in Languages]?: DescriptionLine | String
   }

   /**
    ** This dose not include investment stats from bungie
    ** Optional
    */
   stats?: Stats
}
