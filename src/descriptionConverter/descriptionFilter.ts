import { DescriptionLine, LinesContent } from '@components/itemPopup/provider/providerInterfaces'
import { getManifest } from '@data/bungieManifest'
import { apiUrls } from '@data/urls'
import convertDescription from '@descriptionConverter/convertDescription'
import { Database, Languages, LivePerk, Perk } from '@redux/interfaces'
import { cleanObject } from '@utils/removeEmptyFromObj'
import _ from 'lodash'

const filteredLocation = _.omit(apiUrls, ['versions', 'live', 'intermediate'])
export type Locations = keyof typeof filteredLocation

type AllClassNames =
   | 'green'
   | 'blue'
   | 'purple'
   | 'yellow'
   | 'center'
   | 'bold'
   | 'pve'
   | 'pvp'
   | 'stasis'
   | 'arc'
   | 'solar'
   | 'void'
   | 'primary'
   | 'special'
   | 'heavy'
   | 'barrier'
   | 'overload'
   | 'unstoppable'
   | 'warlock'
   | 'hunter'
   | 'titan'
   | 'link'
   | 'title'
   | 'formula'
   | 'breakSpaces'
   | 'background'
   | 'enhancedArrow'

interface DescriptionFilter {
   getFromPerk: {
      lastUpload: boolean
      stats: boolean
      type: boolean
      uploadedBy: boolean
      updateTracker: boolean
      languages: Languages[]
   }
   getFromDescription: {
      classNames: boolean
      formula: boolean
      link: boolean
      title: boolean
      table: boolean
      weaponTypes: boolean
      /** If array is empty includes all */
      includeClassNames: AllClassNames[]
   }

   // extra stuff
   editor: 'main' | 'secondary'
   optional: boolean
   toStringConverterOptions?: {
      classNames?: {
         [key: string]: [string, string]
      }
      title?: [string, string, string, string]
      link?: [string, string, string, string]
   }
}

// things to include perks
const filters: { [key in Locations]: DescriptionFilter } = {
   clarity: {
      getFromPerk: {
         lastUpload: true,
         stats: true,
         type: true,
         uploadedBy: true,
         updateTracker: false,
         languages: []
      },
      getFromDescription: {
         classNames: true,
         formula: true,
         link: true,
         title: true,
         table: true,
         weaponTypes: true,
         includeClassNames: []
      },

      // extra stuff
      editor: 'main',
      optional: false
   },
   dim: {
      getFromPerk: {
         lastUpload: false,
         stats: false,
         type: false,
         uploadedBy: false,
         updateTracker: false,
         languages: []
      },
      getFromDescription: {
         classNames: true,
         formula: false,
         link: true,
         title: false,
         table: false,
         weaponTypes: false,
         includeClassNames: ['center', 'bold', 'breakSpaces', 'background', 'enhancedArrow']
      },

      // extra stuff
      editor: 'secondary',
      optional: false
   },
   crayon: {
      getFromPerk: {
         lastUpload: true,
         stats: true,
         type: true,
         uploadedBy: true,
         updateTracker: false,
         languages: []
      },
      getFromDescription: {
         classNames: true,
         formula: false,
         link: true,
         title: false,
         table: false,
         weaponTypes: false,
         includeClassNames: [
            'stasis',
            'arc',
            'solar',
            'void',
            'primary',
            'special',
            'heavy',
            'pve',
            'pvp',
            'background',
            'bold'
         ]
      },

      // extra stuff
      editor: 'secondary',
      optional: true,
      toStringConverterOptions: {
         classNames: {
            stasis: ['<:stasis:915198000727461909>', ''],
            arc: ['<:arc:720178925317128243>', ''],
            solar: ['<:solar:720178909361995786>', ''],
            void: ['<:void:720178940240461864>', ''],
            primary: ['<:primary:968793055677251604>', ''],
            special: ['<:special:968793055631114330>', ''],
            heavy: ['<:heavy:968793055652106320>', ''],

            pve: ['<:pve:922884406073507930>', ''],
            pvp: ['<:pvp:922884468275019856>', ''],

            background: ['**', '**'],
            bold: ['**', '**']
         },
         title: ['', '', '', ''],
         link: ['[', ']', '(', ')']
      }
   },
   lightGG: {
      getFromPerk: {
         lastUpload: true,
         stats: false,
         type: false,
         uploadedBy: false,
         updateTracker: true,
         languages: []
      },
      getFromDescription: {
         classNames: true,
         formula: false,
         link: true,
         title: false,
         table: false,
         weaponTypes: false,
         includeClassNames: ['center', 'bold', 'breakSpaces', 'background', 'enhancedArrow']
      },

      // extra stuff
      editor: 'secondary',
      optional: false
   }
}

function filterClassNames(classNames: (string | undefined)[] | undefined, classNameFilters: string[]) {
   if (classNames === undefined || classNameFilters.length === 0) return classNames
   return classNames.filter((className) => {
      return [...classNameFilters, 'spacer'].some((c) => c === className)
   })
}

function convertPvpText(
   text: string | undefined,
   classNames: (string | undefined)[] | undefined,
   classNameFilters: string[]
) {
   if (!text) return text
   // if pvp classes included in filter do nothing
   if (classNameFilters.includes('pvp')) return text
   // if where are no pvp classes do nothing
   if (!classNames?.includes('pvp')) return text

   const pvpText = text.match(/\[[+-]?\d+(\.\d+)?[%?]*?\]/g)?.[0].replace(/\[|\]/g, '')
   if (!pvpText) return text
   return text.replace(pvpText, `PVP: ${pvpText}`)
}

function descriptionToString(description: DescriptionLine[] | undefined, location: Locations) {
   const options = filters[location].toStringConverterOptions
   return description
      ?.reduce((acc, line) => {
         if (line.classNames?.includes('spacer')) return (acc = acc + '\n')

         const newLine = line.linesContent?.reduce((acc, linesContent) => {
            if (linesContent.link && options?.link) {
               const [textStart, textEnd, linkStat, linkEnd] = options.link
               acc = acc + `${textStart}${linesContent.text}${textEnd}` + `${linkStat}${linesContent.link}${linkEnd}`
               return acc
            }

            if (linesContent.classNames && linesContent.classNames?.length !== 0 && options?.classNames) {
               const newText = Object.entries(linesContent.classNames).reduce((acc, className) => {
                  const [classNameStart, classNameEnd] = className
                  acc = acc + `${classNameStart}${linesContent.text}${classNameEnd}`
                  return acc
               }, '')
               acc = acc + newText
               return acc
            }
            acc = acc + linesContent.text
            return acc
         }, '')

         if (line.classNames && line.classNames?.length !== 0 && options?.classNames) {
            const lineWithClassNames = Object.entries(line.classNames).reduce((acc, className) => {
               const [classNameStart, classNameEnd] = className
               acc = acc + `${classNameStart}${newLine}${classNameEnd}`
               return acc
            }, '')
            acc = acc + '\n' + lineWithClassNames
            return acc
         }

         acc = acc + '\n' + newLine
         return acc
      }, '')
      .trim()
}

export function descriptionFilter(description: DescriptionLine[] | undefined, location: Locations) {
   const filter = filters[location].getFromDescription
   const newDescription = description?.reduce((acc: DescriptionLine[], line: DescriptionLine) => {
      // removes tables with formula only
      if (!filter.formula && line.isFormula) return acc
      // removes tables
      if (!filter.table && line.table) return acc
      // removes weapon types
      if (!filter.weaponTypes && line.weaponTypes) return acc

      const newLinesContent = line.linesContent?.reduce<LinesContent[]>((acc, line) => {
         // removes formulas from inside line
         if (!filter.formula && line?.formula) return acc

         // remove title class name if title content is undefined
         let filteredClassNames = line.classNames
         if (line.classNames?.includes('title') && line.title === undefined) {
            filteredClassNames = line.classNames.filter(c => !c?.includes('title'))
         }

         acc.push({
            classNames: filterClassNames(filteredClassNames, filter.includeClassNames),
            text: convertPvpText(line.text, line.classNames, filter.includeClassNames),
            formula: line.formula,
            link: filter.link ? line.link : undefined,
            title: filter.title ? line.title : undefined
         })

         return acc
      }, [])

      const newClassNames = filterClassNames(line.classNames, filter.includeClassNames)

      if (newLinesContent?.length === 0 && newClassNames?.length === 0) return acc

      acc.push({
         classNames: filterClassNames(line.classNames, filter.includeClassNames),
         linesContent: newLinesContent
      })
      return acc
   }, [])

   // remove spacer from end of description
   let removeSpacer = true
   const finalDescription = newDescription?.reduceRight((acc: DescriptionLine[], line: DescriptionLine) => {
      if (line.classNames?.includes('spacer') && removeSpacer) return acc

      removeSpacer = false
      acc.unshift(line)
      return acc
   }, [])

   if (!filters[location].toStringConverterOptions) return finalDescription

   return descriptionToString(finalDescription, location)
}

type GetFromPerk =
   | 'hash'
   | 'name'
   | 'itemHash'
   | 'itemName'
   | 'lastUpload'
   | 'stats'
   | 'type'
   | 'uploadedBy'
   | 'updateTracker'

const getStuffFromPerk = (perk: Perk, filters: DescriptionFilter['getFromPerk']) => {
   const getFromPerk: GetFromPerk[] = ['hash', 'name', 'itemHash', 'itemName']

   Object.entries(filters).forEach(([filter, value]) => {
      if (value) getFromPerk.push(filter as GetFromPerk)
   })

   const newPerk = _.pick(perk, getFromPerk)

   // get selected languages // get all if none are selected
   const filteredDescriptionList =
      filters.languages.length === 0
         ? newPerk.updateTracker?.descriptions
         : _.pick(newPerk.updateTracker?.descriptions, filters.languages)

   // remove stats from update tracker if perk has no stats
   if (!newPerk.stats) {
      return {
         ...newPerk,
         updateTracker: {
            descriptions: filteredDescriptionList
         }
      }
   }
   return newPerk
}

export async function databaseFilter(dataBase: Database, location: Locations) {
   const bungieManifest = await getManifest()
   const filter = filters[location]
   const newDatabase = _.transform(dataBase, (acc: { [key: string]: LivePerk }, perk, hash) => {
      // first 10 are reserved for internal use only
      if (Number(hash) < 10) return

      const editorDescription = perk.editor.en?.main.trim()

      // remove perks with out description
      if (editorDescription === '') return

      // remove optional perks
      if (!filter.optional && perk.optional) return

      // remove perks with bungie description
      if (!filter.optional && editorDescription === bungieManifest[hash]?.displayProperties?.description) return

      const cleanPerk = getStuffFromPerk(perk, filter.getFromPerk)

      // remove not included languages // if filter is empty include all
      const descriptionLanguages =
         filter.getFromPerk.languages.length === 0 ? perk.editor : _.pick(perk.editor, filter.getFromPerk.languages)

      const descriptions = _.transform(
         descriptionLanguages,
         (acc: { [key in Languages]?: any }, descriptions, language_) => {
            const language = language_ as Languages
            const convertedDescription = convertDescription(
               descriptions[filter.editor],
               filter.editor,
               language,
               Number(hash)
            )

            acc[language] = descriptionFilter(convertedDescription, location)
         }
      )

      acc[hash] = {
         ...cleanPerk,
         descriptions
      }
   })

   return cleanObject(newDatabase)
}
