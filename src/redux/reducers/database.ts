import { Database, IntermediatePerk, Stat, StatNames } from '@icemourne/description-converter'
import { GlobalState } from '../interfaces'
import { PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'
import { cleanObject } from '@icemourne/tool-box'
import { getLoginDetails } from 'src/utils/getLogin'
import { useAppSelector } from '../hooks'

export type ButtonActions = 'uploadToLive' | 'hidden' | 'optional'
type State = WritableDraft<GlobalState>

export const databaseReducers = {
   togglePerkStuff: (state: State, action: PayloadAction<ButtonActions>) => {
      const currentlySelected = state.settings.currentlySelected
      state.database[currentlySelected][action.payload] = !state.database[currentlySelected][action.payload]
   },
   updateEditorValue: (state: State, action: PayloadAction<[string, 'main' | 'secondary']>) => {
      const currentlySelected = state.settings.currentlySelected,
         language = state.settings.language
      const editor = action.payload[1],
         description = action.payload[0].replaceAll('\r', '')

      // add langue if it's not already there
      if (state.database[currentlySelected].editor[language] === undefined) {
         state.database[currentlySelected].editor[language] = {
            main: '',
            secondary: ''
         }
      }
      state.database[currentlySelected].editor[language]![editor] = description
      state.database[currentlySelected].updateTracker.descriptions[language] = {
         lastUpdate: Date.now(),
         updatedBy: getLoginDetails()?.username || ''
      }

      if (state.settings.globalUploadToLive) {
         state.database[currentlySelected].uploadToLive = true
      }
   },
   addStat: (state: State, action: PayloadAction<{ hash: number; statName: StatNames; stat: Stat }>) => {
      const { hash, statName, stat } = action.payload

      state.database[hash].stats ? null : (state.database[hash].stats = {})
      state.database[hash].stats![statName] ? null : (state.database[hash].stats![statName] = [])

      // add new stat
      state.database[hash].stats![statName]!.push(stat)
      // remove stuff we don't need
      state.database[hash] = cleanObject(state.database[hash])
      // make sure other is always last one
      state.database[hash].stats![statName]?.sort((a, b) => (b.weaponTypes === undefined ? -1 : 1))

      state.database[hash].updateTracker.stats = {
         lastUpdate: Date.now(),
         updatedBy: getLoginDetails()?.username || ''
      }
   },
   removeStat: (state: State, action: PayloadAction<{ hash: number; statName: StatNames; index: number }>) => {
      const { hash, statName, index } = action.payload

      state.database[hash].stats![statName]!.splice(index, 1)
      state.database[hash] = cleanObject(state.database[hash])

      state.database[hash].updateTracker.stats = {
         lastUpdate: Date.now(),
         updatedBy: getLoginDetails()?.username || ''
      }
   },
   setStatImport: (state: State, action: PayloadAction<{addImportTo: number, importFrom: number}>) => {
      const {addImportTo, importFrom} = action.payload

      state.database[addImportTo].importStatsFrom = importFrom === 0 ? undefined : importFrom
      state.database[addImportTo].updateTracker.stats = {
         lastUpdate: Date.now(),
         updatedBy: getLoginDetails()?.username || ''
      }
   },
   addPerk: (state: State, action: PayloadAction<{ hash: number; perk: IntermediatePerk }>) => {
      state.database = {
         ...state.database,
         [action.payload.hash]: action.payload.perk
      }
   },
   resetPerk: (state: State, action: PayloadAction<number>) => {
      state.database[action.payload] = state.originalDatabase.live[action.payload]
   },
   updateDatabase: (state: State, action: PayloadAction<{databaseType: 'live' | 'intermediate', newDatabase: Database}>) => {
      const {databaseType, newDatabase} = action.payload
      state.originalDatabase[databaseType] = newDatabase
   },
}
/**
 * @param hash Optional perk hash
 * @returns If hash was provided and perk found returns that perk otherwise return selected perk
 */
export const getPerk = (hash?: number) => {
   const currentState = useAppSelector((state) => state.global)
   if (hash) {
      return currentState.database[hash] || currentState.database[currentState.settings.currentlySelected]
   }
   return currentState.database[currentState.settings.currentlySelected]
}
