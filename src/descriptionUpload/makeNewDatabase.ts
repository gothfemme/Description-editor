import { Database, IntermediatePerk } from '@icemourne/description-converter'

import _ from 'lodash'
import { getLoginDetails } from 'src/utils/getLogin'
import { store } from 'src/redux/store'

export const makeNewDatabase = (
   saveDatabaseType: 'intermediate' | 'live',
   currentlyLiveDatabase: Database,
   uploadingToLive: boolean = false
) => {
   const globalState = store.getState().global
   const originalDatabase = globalState.originalDatabase[saveDatabaseType]
   const modifiedDatabase = globalState.database

   const uploadInfo = {
      uploadedBy: getLoginDetails()?.username || '',
      lastUpload: Date.now()
   }

   return _.transform(modifiedDatabase, (acc: Database, modifiedPerk, modifiedPerkHash) => {
      // if perk was deleted it will not be added to new database

      // if where are no changes made return perk from live database
      if (_.isEqual(modifiedPerk, originalDatabase[modifiedPerkHash])) {
         acc[modifiedPerkHash] = currentlyLiveDatabase[modifiedPerkHash]
         return
      }

      // if data is going to be uploaded to live database check if perk should be updated
      if (
         saveDatabaseType === 'live' &&
         modifiedPerk.uploadToLive === false &&
         currentlyLiveDatabase[modifiedPerkHash]
      ) {
         acc[modifiedPerkHash] = currentlyLiveDatabase[modifiedPerkHash]
         return
      }

      // add new perk
      if (originalDatabase[modifiedPerkHash] === undefined) {
         acc[modifiedPerkHash] = { ...modifiedPerk, ...uploadInfo }
         return
      }

      acc[modifiedPerkHash] = _.transform(modifiedPerk, (acc: IntermediatePerk, valueInPerk, keyInPerk) => {
         // if value was deleted it will not be added to new perk

         // if where are no changes made return perk from live database
         if (_.isEqual(valueInPerk, originalDatabase[modifiedPerkHash][keyInPerk])) {
            // @ts-ignore
            acc[keyInPerk] = currentlyLiveDatabase[modifiedPerkHash][keyInPerk]
            return
         }

         if (!_.isObject(valueInPerk)) {
            // @ts-ignore
            acc[keyInPerk] = valueInPerk
            return
         }

         // @ts-ignore
         acc[keyInPerk] = _.transform(valueInPerk, (acc: IntermediatePerk, value, key) => {
            // if value was deleted it will not be added to new perk

            // if where are no changes made return perk info from live database
            if (_.isEqual(value, originalDatabase[modifiedPerkHash][keyInPerk]?.[key])) {
               // @ts-ignore
               acc[key] = currentlyLiveDatabase[modifiedPerkHash][keyInPerk][key]
               return
            }

            acc[key] = value
         })
      })
      if (uploadingToLive) {
         acc[modifiedPerkHash] = {
            ...acc[modifiedPerkHash],
            uploadToLive: false,
            inLiveDatabase: true
         }
      }
      acc[modifiedPerkHash] = { ...acc[modifiedPerkHash], ...uploadInfo }
   })
}
