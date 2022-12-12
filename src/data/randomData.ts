import { Languages } from '@redux/interfaces'

const specialWrappers = ['green', 'blue', 'purple', 'yellow', 'center', 'bold', 'pve', 'pvp']

export const wrappers = {
   imageAdding: [
      'stasis',
      'arc',
      'solar',
      'void',

      'primary',
      'special',
      'heavy',

      'barrier',
      'overload',
      'unstoppable',

      'warlock',
      'hunter',
      'titan'
   ],
   complicated: ['link', 'title', 'formula'],
   lineEffecting: [...specialWrappers, 'breakSpaces', 'background'],
   textEffecting: specialWrappers
}

export const selfContainedArr = [...wrappers.imageAdding, ...wrappers.lineEffecting]

export const weaponTypesToNames: {[key: string]: string} = {
   'auto rifle': 'AR',
   'combat bow': 'Bow',
   'fusion rifle': 'Fusion',
   'glaive': 'Glaive',
   'grenade launcher': 'GL',
   'hand cannon': 'HC',
   'heavy grenade launcher': 'Heavy GL',
   'linear fusion rifle': 'LFR',
   'machine gun': 'LMG',
   'pulse rifle': 'Pulse',
   'rocket launcher': 'Rocket',
   'scout rifle': 'Scout',
   'shotgun': 'Shotgun',
   'sidearm': 'Sidearm',
   'sniper rifle': 'Sniper',
   'submachine gun': 'SMG',
   'sword': 'Sword',
   'trace rifle': 'Trace',

   'super' : 'Super',
   'grenade': 'Grenade',
   'melee': 'Melee'
}

export const nameToWeaponTypes = Object.entries(weaponTypesToNames).reduce<{ [key: string]: string }>(
   (acc, [weapon, name]) => {
      acc[name] = weapon
      return acc
   },
   {}
)
export const weaponTypes = Object.keys(weaponTypesToNames)
export const weaponNames = Object.values(weaponTypesToNames)

export const statsTypes = [
   'aimAssist',
   'airborne',
   'damage',
   'handling',
   'range',
   'ready',
   'reload',
   'rateOfFire',
   'RPM',
   'chargeDraw',
   'stability',
   'stow',
   'zoom'
] as const

export const bungieStatNames = {
   4284893193: 'Rounds Per Minute',
   447667954: 'Draw Time',
   2961396640: 'Charge Time',
   2837207746: 'Swing Speed',
   4043523819: 'Impact',
   3614673599: 'Blast Radius',
   1591432999: 'Accuracy',
   2523465841: 'Velocity',
   2762071195: 'Guard Efficiency',
   209426660: 'Guard Resistance',
   1240592695: 'Range',
   1842278586: 'Shield Duration',
   155624089: 'Stability',
   943549884: 'Handling',
   4188031367: 'Reload Speed',
   1345609583: 'Aim Assistance',
   3555269338: 'Zoom',
   2715839340: 'Recoil Direction',
   3022301683: 'Charge Rate',
   3736848092: 'Guard Endurance',
   3871231066: 'Magazine',
   1931675084: 'Inventory Size',
   925767036: 'Ammo Capacity',
   2714457168: 'Airborne Effectiveness'
} as { [key: string]: string }

export const languages: [Languages, string][] = [
   ['en', 'English'],
   ['de', 'German - Deutsch'],
   ['fr', 'French - Français'],
   ['it', 'Italian - Italiano'],
   ['pl', 'Polish - Polski'],
   ['ru', 'Russian - Русский'],
   ['es', 'Spanish (Spain) - Español (España)'],
   ['es-mx', 'Spanish (Mexico) - Español (México)'],
   ['ko', 'Korean - 한국어'],
   ['pt-rb', 'Portuguese (Brazil) - Português (Brasil)'],
   ['ja', 'Japanese - 日本語'],
   ['zh-cht', 'Chinese (Traditional) - 繁體中文'],
   ['zh-chs', 'Chinese (Simplified) - 简体中文']
]

export const defaultDescription = `
Images you can use in descriptions
<arc/> <void/> <solar/>
<primary/> <special/> <heavy/>
<warlock/> <hunter/> <titan/>
Text coloring
<blue text /> <green text /> <purple text /> <yellow text />
<pvp text /> <pve text />

The same can be done to lines of text <green/>

You probably noticed having multiple spaces in the editor
              doesn't mean it will be the same in description
              you can change that with <breakSpaces/>

// This is comment content after // will not appear in the description

// ----------------------------------------------------------
// weapon type explanation
// they work like if else in programming

// if auto rifle
< weapon type ( AR ) >
    Apply this text
// else if glaive
< ( Glaive ) >
    Apply this text
// else
< ( other ) >
    Apply this text to all weapons not specified in this block
<$$>
// also, you can preview how it would look on x weapon by selecting the weapon in the weapon popup under the weapons name
// ----------------------------------------------------------
If there is something you want just ask
This is not everything you can do btw

To see the full list press CTRL + SPACE
Also, CTRL + F is a thing and can be used to find and replace
Also also editor has other stuff to see them press F1
`.trim()
