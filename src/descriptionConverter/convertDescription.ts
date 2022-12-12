import { DescriptionLine } from '@components/itemPopup/provider/providerInterfaces'
import { Languages } from '@redux/interfaces'
import { store } from '@redux/store'
import { doMath } from './converterFunctions/doMath'
import { extractTitles } from './converterFunctions/extractTitles'
import { loadExports } from './converterFunctions/loadExports'
import { loadVariables } from './converterFunctions/loadVariables'
import { removeEnhanced } from './converterFunctions/removeEnhanced'
import { removeUnusedText } from './converterFunctions/removeUnusedText'
import { separateTableWeaponType } from './converterFunctions/separateTableWeaponType'

function prepareDescription(
   description: string,
   editorType: 'main' | 'secondary',
   language_?: Languages,
   hash_?: number
) {
   const globalState = store.getState().global
   const language = language_ || globalState.settings.language
   const hash = hash_ || globalState.settings.currentlySelected

   description = loadExports(description, editorType, language, hash)

   if (globalState.database[hash].type !== 'weaponPerkEnhanced') {
      description = removeEnhanced(description)
   }
   description = loadVariables(description, language)
   description = doMath(description)

   return {
      preparedDescription: removeUnusedText(description.trim()),
      titles: {
         ...extractTitles(removeUnusedText(description, false)),
         ...extractTitles(globalState.database[3].editor[language]?.main!),
         ...extractTitles(globalState.database[3].editor[language]?.secondary!)
      }
   }
}

export default function convertDescription(
   description: string,
   editorType: 'main' | 'secondary',
   language?: Languages,
   hash?: number
) {
   const { preparedDescription, titles } = prepareDescription(description, editorType, language, hash)

   const convertedTitles = Object.entries(titles || {}).reduce<{ [key: string]: DescriptionLine[] }>(
      (acc, [titleName, titleContent]) => {
         const updatedTitleContent = prepareDescription(titleContent, editorType, language, hash).preparedDescription

         const convertedTitles = separateTableWeaponType(updatedTitleContent, {})
         if (convertedTitles) acc[titleName] = convertedTitles
         return acc
      },
      {}
   )

   const separated = separateTableWeaponType(preparedDescription, convertedTitles)
   return separated
}
