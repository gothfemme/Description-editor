import { changePerkType, changeSelectedPerk } from 'src/redux/globalSlice'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { useEffect, useState } from 'react'
import { PerkTypes } from '@icemourne/description-converter'
import { Select } from '../universal/Select'
import { cnc } from 'src/utils/classNameCombiner'
import { store } from 'src/redux/store'
import styles from './Selection.module.scss'
import { useImmer } from 'use-immer'

export function DescriptionTypeSelection({
   value,
   onChange
}: {
   value: PerkTypes
   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
   return (
      <Select value={value} onChange={onChange}>
         <option value="none">Select description type</option>

         <optgroup label="Exotics">
            <option value="Armor Perk Exotic">Armor</option>
            <option value="Weapon Perk Exotic">Weapon Perk</option>
            <option value="Weapon Frame Exotic">Weapon Frame</option>
            <option value="Weapon Catalyst Exotic">Catalyst</option>
         </optgroup>

         <optgroup label="Weapon">
            <option value="Weapon Perk">Perk</option>
            <option value="Weapon Perk Enhanced">Enhanced Perk</option>
            <option value="Weapon Origin Trait">Origin Trait</option>
            <option value="Weapon Frame">Frame</option>
         </optgroup>

         <optgroup label="Abilities / Subclass Options">
            <option value="Subclass Fragment">Fragment</option>
            <option value="Subclass Aspect">Aspect</option>
            <option value="Subclass Super">Super</option>
            <option value="Subclass Grenade">Grenade</option>
            <option value="Subclass Melee">Melee</option>
            <option value="Subclass Class">Class</option>
            <option value="Subclass Movement">Movement</option>
         </optgroup>

         <optgroup label="Mods">
            <option value="Armor Mod General">Armor General</option>
            <option value="Armor Mod Combat">Armor Combat</option>
            <option value="Armor Mod Activity">Armor Activity</option>
            <option value="Armor Mod Seasonal">Armor Seasonal</option>
            <option value="Weapon Mod">Weapon</option>
            <option value="Ghost Mod">Ghost</option>
         </optgroup>
      </Select>
   )
}

export function PerkSelection() {
   const dispatch = useAppDispatch()
   const globalState = useAppSelector((state) => state.global)

   const settings = globalState.settings
   const database = globalState.database

   // filters and sorts perks
   const [displayedPerkList, setDisplayedPerkList] = useImmer<string[]>([])
   useEffect(() => {
      const selectedPerkHashes = Object.keys(database).filter((hash) => database[hash].type === settings.selectedType)

      const sortedPerkHashes = selectedPerkHashes.sort((a, b) => {
         if (database[a].itemName && database[b].itemName) {
            return database[a].itemName!.localeCompare(database[b].itemName!)
         }
         return database[a].name.localeCompare(database[b].name)
      })

      setDisplayedPerkList(sortedPerkHashes)
      dispatch(changeSelectedPerk(Number(sortedPerkHashes[0]) || 0))
   }, [settings.selectedType])

   // change selected perk with shift mouse wheel
   const [externalEvent, setExternalEvent] = useState<WheelEvent | null>(null)
   useEffect(() => {
      const changePerkEvent = (e: WheelEvent) => {
         if (!e.shiftKey) return
         e.preventDefault()
         setExternalEvent(e)
      }
      window.addEventListener('wheel', changePerkEvent, { passive: false })
   }, [externalEvent])
   useEffect(() => {
      if (externalEvent === null) return
      const currentlySelected = store.getState().global.settings.currentlySelected
      const index = Object.values(displayedPerkList).findIndex((hash) => Number(hash) === currentlySelected)

      const perkHash =
         externalEvent.deltaY < 0
            ? displayedPerkList[Math.max(index - 1, 0)]
            : displayedPerkList[Math.min(index + 1, displayedPerkList.length - 1)]

      if (perkHash) dispatch(changeSelectedPerk(Number(perkHash)))
   }, [externalEvent])

   return (
      <>
         <DescriptionTypeSelection
            value={settings.selectedType}
            onChange={(e) => dispatch(changePerkType(e.target.value as PerkTypes))}
         />
         <Select
            onChange={(e) => {
               dispatch(changeSelectedPerk(Number([e.target.value])))
            }}
            value={settings.currentlySelected}
         >
            {displayedPerkList.map((perkHash, i) => {
               if (database[perkHash] === undefined) return
               return (
                  <option
                     key={i}
                     value={perkHash}
                     className={cnc(database[perkHash].hidden && !settings.displayHiddenPerks, styles.hidden)}
                  >
                     {database[perkHash].itemName || database[perkHash].name}
                     {Number(perkHash) > 10 && (
                        <>
                           {database[perkHash].inLiveDatabase ? '' : `❌`}
                           {database[perkHash].hidden ? ' 😴' : ''}
                           {settings.language !== 'en' &&
                           database[perkHash].updateTracker.descriptions[settings.language]?.lastUpdate! <
                              database[perkHash].updateTracker.descriptions.en?.lastUpdate!
                              ? ' ⏳'
                              : ''}
                        </>
                     )}
                  </option>
               )
            })}
         </Select>
      </>
   )
}
