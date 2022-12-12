import './App.scss'

import Editor from '@components/editor/Editor'
import { Note } from '@components/itemPopup/Extra'
import { Header } from '@components/itemPopup/Header'
import { Perks } from '@components/itemPopup/Perks'
import { Sockets } from '@components/itemPopup/Sockets'
import { Stats } from '@components/itemPopup/Stats'
import { AddNewPerk } from '@components/sideBar/AddNewPerks'
import { BasicInfo } from '@components/sideBar/BasicItemInfo'
import {
   ButtonChangeEditor,
   ButtonDeletePerk,
   ButtonToggleHiddenPerks,
   ButtonUploadIce,
   ButtonUploadIntermediate, MultiButton, ResetDescription,
   ToggleGlobalUploadToLive
} from '@components/sideBar/Buttons'
import { Login } from '@components/sideBar/Login'
import { Message } from '@components/sideBar/Message'
import { PerkSelection } from '@components/sideBar/Selection'

import { LanguageSelection } from '@components/sideBar/LanguageSelection'
import { StrictMode, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createEditor } from './components/editor/monaco/monacoEditor'

import { PerkLinking } from '@components/sideBar/PerkLinking'
import { NewStatSelection } from '@components/sideBar/stats/NewStatSelection'
import { UpdateTracker } from '@components/sideBar/UpdateTracker'
import { VerticalDivider } from '@components/universal/VerticalDivider'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { store } from '@redux/store'
import { Provider } from 'react-redux'

import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@components/universal/Button'
import { changePerkType, changeSelectedPerk } from '@redux/globalSlice'

function ErrorFallback(setExplode: React.Dispatch<React.SetStateAction<boolean>>) {
   const dispatch = useAppDispatch()

   const onReset = () => {
      dispatch(changePerkType('none'))
      dispatch(changeSelectedPerk(0))
      setExplode(e => !e)
   }

   return (
      <div>
         <h1>Something went wrong</h1>
         <h3>I would recommend uploading before doing anything else</h3>
         <h3>You will get confirmation message then upload is complete</h3>
         <h3>Well unless upload caused crash then F</h3>
         <ButtonUploadIntermediate labelText="Upload - Secondary Database" />

         <h3>You can try resetting depending on why it crashed that maybe will fix it</h3>
         <h3>If nothing happens then you press button it means it crashed again and you need to reload</h3>
         <Button onClick={onReset}>Reset</Button>

         <Message />
      </div>
   )
}

function App() {
   const globalState = useAppSelector((state) => state.global)
   const newPerkWindow = globalState.settings.newPerkWindow
   const allowPerkLinking = globalState.settings.selectedType === 'weaponPerk'

   const [explode, setExplode] = useState(false)
   return (
      <ErrorBoundary
         FallbackComponent={() => ErrorFallback(setExplode)}
         onReset={() => setExplode(false)}
         resetKeys={[explode]}
      >
         <div className="item_popup">
            <Header />
            <Note />
            <Stats />
            <Sockets />
            <Perks />
         </div>
         <Editor onMount={createEditor} />
         <div className="side_bar">
            {!newPerkWindow && (
               <>
                  <PerkSelection />
                  <LanguageSelection />
                  <BasicInfo />
                  <NewStatSelection />
                  <VerticalDivider />
               </>
            )}
            <AddNewPerk />

            {!newPerkWindow && (
               <>
                  <ButtonDeletePerk />
                  {allowPerkLinking && <PerkLinking />}
                  <VerticalDivider />
                  <MultiButton action="optional" />
                  <MultiButton action="hidden" />
                  <ButtonToggleHiddenPerks />
                  <VerticalDivider />

                  <ButtonChangeEditor />
                  <ResetDescription />
                  <VerticalDivider />

                  <ToggleGlobalUploadToLive />
                  <MultiButton action="uploadToLive" />
                  <ButtonUploadIce labelText="Upload - Live database" />
                  <ButtonUploadIntermediate labelText="Upload - Secondary Database" />
                  <VerticalDivider />

                  <Message />
                  <Login />

                  <VerticalDivider />
                  <UpdateTracker />
               </>
            )}
         </div>
      </ErrorBoundary>
   )
}
ReactDOM.createRoot(document.getElementById('app')!).render(
   <StrictMode>
      <Provider store={store}>
         <App />
      </Provider>
   </StrictMode>
)
