import { Select } from '@components/universal/Select'
import { changePerkType, changeSelectedPerk } from '@redux/globalSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { PerkTypes } from '@redux/interfaces'
import { store } from '@redux/store'
import { cnc } from '@utils/classNameCombiner'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import styles from './Selection.module.scss'

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
            <option value="armorExotic">Armor</option>
            <option value="weaponPerkExotic">Weapon Perk</option>
            <option value="weaponFrameExotic">Weapon Frame</option>
            <option value="weaponCatalystExotic">Catalyst</option>
         </optgroup>

         <optgroup label="Weapon">
            <option value="weaponPerk">Perk</option>
            <option value="weaponPerkEnhanced">Enhanced Perk</option>
            <option value="weaponOriginTrait">Origin Trait</option>
            <option value="weaponFrame">Frame</option>
         </optgroup>

         <optgroup label="Abilities / Subclass Options">
            <option value="fragment">Fragment</option>
            <option value="aspect">Aspect</option>
            <option value="super">Super</option>
            <option value="grenade">Grenade</option>
            <option value="melee">Melee</option>
            <option value="class">Class</option>
            <option value="movement">Movement</option>
         </optgroup>

         <optgroup label="Mods">
            <option value="armorModGeneral">Armor General</option>
            <option value="armorModCombat">Armor Combat</option>
            <option value="armorModActivity">Armor Activity</option>
            <option value="armorModSeasonal">Armor Seasonal</option>
            <option value="weaponMod">Weapon</option>
            <option value="ghostMod">Ghost</option>
            {/* <option value="artifactMod">Artifact</option> */}
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
