import { useAppSelector } from '@redux/hooks'

import styles from './UpdateTracker.module.scss'

export function UpdateTracker() {
   const globalState = useAppSelector((state) => state.global)
   const database = globalState.database
   const settings = globalState.settings

   const language = settings.language
   const currentlySelected = settings.currentlySelected

   const selectedPerk = database[currentlySelected]
   const updateTracker = selectedPerk.updateTracker

   return (
      <div className={styles.info_display}>
         <div>Upload</div>
         <label>Upload time</label>
         <span>{new Date(selectedPerk.lastUpload).toLocaleString()}</span>
         <label>Uploaded by</label>
         <span>{selectedPerk.uploadedBy}</span>

         <div>Description in selected language</div>
         <label>Update time</label>
         <span>{new Date(updateTracker.descriptions[language]?.lastUpdate || 0).toLocaleString()}</span>
         <label>Updated by</label>
         <span>{updateTracker.descriptions[language]?.updatedBy}</span>

         <div>Stats</div>
         <label>Update time</label>
         <span>{new Date(updateTracker.stats?.lastUpdate || 0).toLocaleString()}</span>
         <label>Updated by</label>
         <span>{updateTracker.stats?.updatedBy}</span>
      </div>
   )
}
