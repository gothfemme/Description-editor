import { useAppSelector } from '@redux/hooks'
import { Perk, PerkTypes } from '@redux/interfaces'
import styles from './BasicItemInfo.module.scss'

export function InfoDisplayOptions({selectedType, selectedPerk}: {selectedType: PerkTypes, selectedPerk: Perk}) {
   switch (selectedType) {
      case 'armorExotic':
      case 'weaponFrameExotic':
      case 'weaponCatalystExotic':
      case 'weaponPerkExotic':
         return (
            <>
               <label>Item name</label>
               <span>{selectedPerk.itemName || ''}</span>
               <label>Item hash</label>
               <span>{selectedPerk.itemHash || ''}</span>
               <label>Name</label>
               <span>{selectedPerk.name}</span>
               <label>Hash</label>
               <span>{selectedPerk.hash}</span>
            </>
         )
      default:
         return (
            <>
               <label>Name</label>
               <span>{selectedPerk.name}</span>
               <label>Hash</label>
               <span>{selectedPerk.hash}</span>
            </>
         )
   }
}

export function BasicInfo() {
   const globalState = useAppSelector((state) => state.global)
   const database = globalState.database
   const settings = globalState.settings

   const currentlySelected = settings.currentlySelected
   const selectedPerk = database[currentlySelected]

   return (
      <div className={styles.info_display}>
         <InfoDisplayOptions selectedType={settings.selectedType}  selectedPerk={selectedPerk} />
      </div>
   )
}
