import { Select } from '@components/universal/Select'
import { linkWithEnhanced } from '@redux/globalSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

import styles from './PerkLinking.module.scss'

export function PerkLinking() {
   const database = useAppSelector((state) => state.global.database)
   const currentlySelected = useAppSelector((state) => state.global.settings.currentlySelected)
   const dispatch = useAppDispatch()

   const onEnhancedPerkSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const enhancedPerkHash = e.target.value
      dispatch(
         linkWithEnhanced({
            enhancedPerkHash: Number(enhancedPerkHash),
            normalPerkHash: currentlySelected
         })
      )
   }

   const enhancedPerkHashes = Object.values(database).flatMap((perk) => {
      if (perk.type !== 'weaponPerkEnhanced') return []
      return perk.hash
   })
   const sortedEnhancedPerkHashes = enhancedPerkHashes.sort((a, b) => database[a].name.localeCompare(database[b].name))

   return (
      <div className={styles.box}>
         <div>Enhanced perk linking</div>
         <Select onChange={onEnhancedPerkSelection} value={database[currentlySelected].linkedWith || 0}>
            <option value={0}>None</option>
            {sortedEnhancedPerkHashes.map((hash, i) => (
               <option value={hash} key={i}>
                  {database[hash].name}
               </option>
            ))}
         </Select>
      </div>
   )
}