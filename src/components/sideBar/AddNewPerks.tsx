import { Button } from '@components/universal/Button'
import { getManifest } from '@data/bungieManifest'
import { addPerk, changePerkType, toggleNewPerkWindow } from '@redux/globalSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { Perk, PerkTypes } from '@redux/interfaces'
import { defaultPerk } from '@redux/store'
import { sendMessage } from '@utils/sendMessage'
import { useEffect, useState } from 'react'

import styles from './AddNewPerks.module.scss'
import { InfoDisplayOptions } from './BasicItemInfo'
import { Message } from './Message'
import { DescriptionTypeSelection } from './Selection'

interface InventoryItem {
   displayProperties: {
      name: string
      description: string
      icon: string
      hasIcon: boolean
   }
   inventory: {
      tierType: number
   }
   plug: {
      plugCategoryHash: number
   }
   itemTypeDisplayName: string
   itemCategoryHashes: number[]
   itemType: number
   investmentStats: {
      statTypeHash: number
      value: number
      isConditionallyActive: boolean
   }[]
}

const filterOutBadPerks = (perk: InventoryItem) => {
   // check if perk has name and icon
   if (perk.displayProperties.name === '' || !perk.displayProperties.hasIcon) return true

   // check if it's non exotic armor and weapons
   if ((perk.itemType === 2 || perk.itemType === 3) && perk.inventory.tierType !== 6) return true

   // check if item category hash is blacklisted // complete list
   const blacklisted_itemCategoryHashes = [
      16, 18, 19, 34, 35, 39, 40, 41, 42, 43, 44, 49, 53, 55, 56, 58, 208981632, 268598612, 1112488720, 1404791674,
      1742617626, 1784235469, 1875601085, 2088636411, 2423200735, 3109687656, 3124752623, 3229540061, 3684181176,
      3726054802, 141186804, 177260082, 3683250363, 3301210334, 713159888, 945330047, 1576735337, 874645359, 4062965806,
      1826038950, 1378222069, 1873949940
   ]
   const blacklisted_itemCategoryHash = perk.itemCategoryHashes?.some((c) =>
      blacklisted_itemCategoryHashes.some((b) => b === c)
   )
   if (blacklisted_itemCategoryHash) return true

   // check if perk is deprecated
   if (perk.itemTypeDisplayName.toLocaleLowerCase().includes('deprecated')) return true
   // check if it's legacy perk
   if (perk.itemTypeDisplayName.toLocaleLowerCase().includes('legacy')) return true

   const blacklistedNames = [
      'upgrade ghost',
      'upgrade masterwork',
      'upgrade armor',
      'mask upgrade',
      'change energy type'
   ]
   if (blacklistedNames.some((name) => perk.displayProperties.name.toLocaleLowerCase().includes(name))) return true
   if (perk.displayProperties.name.match(/Tier \d+ /)) return true

   return false
}

export function AddNewPerk() {
   const dispatch = useAppDispatch()
   const menuStatus = useAppSelector((state) => state.global.settings.newPerkWindow)
   const database = useAppSelector((state) => state.global.database)
   const settings = useAppSelector((state) => state.global.settings)
   const [inventoryItem, setInventoryItem] = useState<{ [key: string]: InventoryItem }>({})

   const [filteredPerks, setFilteredPerks] = useState<number[]>([])

   // get item list from bungie
   useEffect(() => {
      ;(async () => {
         const invItem = await getManifest()
         const cleanedInvItem = Object.entries(invItem).reduce((acc, [hash, perk]) => {
            // remove junk
            if (filterOutBadPerks(perk)) return acc
            // remove perks already in database
            if (database[hash] !== undefined) return acc
            acc[hash] = perk
            return acc
         }, {} as { [key: string]: InventoryItem })

         setInventoryItem(cleanedInvItem)
         setFilteredPerks(Object.keys(cleanedInvItem).map((x) => Number(x)))
      })()
   }, [])

   const filterPerks = (input: string) => {
      const newPerkList = Object.keys(inventoryItem).filter((perkHash) =>
         inventoryItem[perkHash].displayProperties.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      )
      setFilteredPerks(newPerkList.map((x) => Number(x)))
   }

   const [perkType, setPerkType] = useState<PerkTypes>('none')
   useEffect(() => {
      setPerkType(settings.selectedType)
   }, [settings.selectedType])

   const selectedPerkPlaceholder = {
      name: '',
      hash: 0,
      itemName: '',
      itemHash: 0,
      editor: {
         en: {
            main: '',
            secondary: ''
         }
      },
      investmentStats: [] as InventoryItem['investmentStats']
   }
   const [selectedPerk, setSelectedPerk] = useState(selectedPerkPlaceholder)

   const addPerkInfo = (perkHash: number) => {
      if (inventoryItem[perkHash].itemType === 2 || inventoryItem[perkHash].itemType === 3) {
         setSelectedPerk({
            ...selectedPerk,
            itemName: inventoryItem[perkHash].displayProperties.name,
            itemHash: perkHash
         })
      } else {
         setSelectedPerk({
            ...selectedPerk,
            name: inventoryItem[perkHash].displayProperties.name,
            hash: perkHash,
            editor: {
               en: {
                  main: inventoryItem[perkHash].displayProperties.description,
                  secondary: inventoryItem[perkHash].displayProperties.description
               }
            },
            investmentStats: inventoryItem[perkHash].investmentStats
         })
      }
   }

   const onAddNewPerk = () => {
      if (perkType === 'none') {
         sendMessage('Select description type first', 'error')
         return
      }
      const selectedPerkInfo = Boolean(perkType.match(/Exotic/))
         ? {
              ...selectedPerk
           }
         : {
              name: selectedPerk.name,
              hash: selectedPerk.hash,
              editor: selectedPerk.editor
           }

      const newPerk: Perk = {
         ...defaultPerk,
         ...selectedPerkInfo,
         type: perkType
      }

      if (newPerk.hash === 0 || newPerk.itemHash === 0) {
         sendMessage(`Missing information`, 'error')
         return
      }
      dispatch(addPerk({ hash: newPerk.hash, perk: newPerk }))
      setSelectedPerk(selectedPerkPlaceholder)
      sendMessage(`Added ${newPerk.name}`, 'success')
   }

   return (
      <>
         {menuStatus && (
            <>
               <DescriptionTypeSelection
                  value={perkType}
                  onChange={(e) => {
                     setPerkType(e.target.value as PerkTypes)
                     dispatch(changePerkType(e.target.value as PerkTypes))
                  }}
               />
               <div>Don't change the description here</div>
               <div className={styles.info_display}>
                  <InfoDisplayOptions selectedType={settings.selectedType} selectedPerk={selectedPerk as Perk} />
               </div>
               <input className={styles.input} onChange={(e) => filterPerks(e.target.value)} />
               <div className={styles.perk_list}>
                  {filteredPerks.map((perkHash, i) => {
                     if (i > 200) return
                     const enhanced = inventoryItem[perkHash].itemTypeDisplayName
                        ?.toLocaleLowerCase()
                        .includes('enhanced')
                     return (
                        <div key={i} className={styles.list}>
                           <span
                              onClick={() => addPerkInfo(perkHash)}
                           >{`${inventoryItem[perkHash].displayProperties.name} `}</span>
                           <a href={`https://data.destinysets.com/i/InventoryItem:${perkHash}`} target="_blank">
                              {perkHash}
                           </a>
                           <span>{` ${enhanced ? '<e>' : ''}`}</span>
                        </div>
                     )
                  })}
               </div>
               <Button onClick={onAddNewPerk}>Add Perk</Button>
            </>
         )}
         <Button onClick={() => dispatch(toggleNewPerkWindow())}>{menuStatus ? 'Close' : 'Add perks'}</Button>
         {menuStatus && <Message />}
      </>
   )
}
