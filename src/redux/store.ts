import { defaultDescription, defaultPerk } from 'src/data/randomData'

import { GlobalState } from './interfaces'
import { configureStore } from '@reduxjs/toolkit'
import { fetchBungieManifest } from '@icemourne/tool-box'
import { getStartUpDescriptions } from 'src/utils/github'
import globalReducer from './globalSlice'

const { live, intermediate } = await getStartUpDescriptions()
const { inventoryItem, stat } = await fetchBungieManifest(['inventoryItem', 'stat'])

const preloadedState: { global: GlobalState } = {
   global: {
      database: {
         ...intermediate,
         0: {
            ...defaultPerk,
            editor: {
               en: {
                  main: defaultDescription,
                  secondary: ''
               }
            }
         }
      },
      settings: {
         currentlySelected: 0,
         language: 'en' as const,
         selectedType: 'none' as const,
         displayHiddenPerks: false,
         editorType: 'normal' as const,
         newPerkWindow: false,
         messages: [],
         weaponType: 'AR' as const,
         globalUploadToLive: false
      },
      originalDatabase: {
         live,
         intermediate
      },
      bungie: {
         inventoryItem,
         stat
      }
   }
}

export const store = configureStore({
   reducer: {
      global: globalReducer
   },
   preloadedState,
   // middleware: (getDefaultMiddleware) =>
   //    getDefaultMiddleware({
   //       thunk: true,
   //       serializableCheck: false,
   //       immutableCheck: false
   //    })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
