import { defaultDescription } from '@data/randomData'
import { configureStore } from '@reduxjs/toolkit'
import { getStartUpDescriptions } from '@utils/github'
import globalReducer from './globalSlice'
import { Perk } from './interfaces'

const { live, intermediate } = await getStartUpDescriptions()

export const defaultPerk: Perk = {
   hash: 0,
   name: 'Default perk',
   type: 'none',
   lastUpload: 0,
   uploadedBy: '',
   editor: {
      en: {
         main: defaultDescription,
         secondary: ''
      }
   },
   updateTracker: {
      stats: {
         lastUpdate: 0,
         updatedBy: ''
      },
      descriptions: {
         en: {
            lastUpdate: 0,
            updatedBy: ''
         }
      }
   },
   uploadToLive: false,
   hidden: false,
   inLiveDatabase: false,
   optional: false
}

const preloadedState = {
   global: {
      database: {
         ...intermediate,
         0: defaultPerk,
      },
      settings: {
         currentlySelected: 0,
         language: 'en' as const,
         selectedType: 'none' as const,
         displayHiddenPerks: false,
         editorType: 'normal' as const,
         newPerkWindow: false,
         messages: [],
         weaponType: 'auto rifle' as const,
         globalUploadToLive: false
      },
      originalDatabase: {
         live: live,
         intermediate: intermediate
      }
   }
}

export const store = configureStore({
   reducer: {
      global: globalReducer
   },
   preloadedState,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         thunk: true,
         serializableCheck: false,
         immutableCheck: false
      })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
