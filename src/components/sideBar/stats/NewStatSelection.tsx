import { Button } from '@components/universal/Button'
import { Select } from '@components/universal/Select'
import { statsTypes, weaponTypes, weaponTypesToNames } from '@data/randomData'
import { addStat, setStatImport } from '@redux/globalSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { StatNames, WeaponTypes } from '@redux/interfaces'
import { sendMessage } from '@utils/sendMessage'
import { statsStringToArray } from '@utils/statsToStringAndBack'
import _ from 'lodash'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import { ImportStats } from './ImportStats'
import styles from './NewStatSelection.module.scss'
import { StatsDisplay } from './StatDisplay'

export function NewStatSelection() {
   const globalState = useAppSelector((state) => state.global)
   const dispatch = useAppDispatch()

   const database = globalState.database
   const currentlySelected = globalState.settings.currentlySelected

   const linkedWith = database[currentlySelected].linkedWith

   const [display, setDisplay] = useState(false)
   const [statName, setStatName] = useState<StatNames | 'none'>('none')

   const [stat, setStats] = useImmer<{
      active: {
         multiplier: number[]
         stat: number[]
      }
      passive: {
         multiplier: number[]
         stat: number[]
      }
      weaponTypes: WeaponTypes[]
   }>({
      active: {
         multiplier: [],
         stat: []
      },
      passive: {
         multiplier: [],
         stat: []
      },
      weaponTypes: []
   })

   const [displayStats, setDisplayStats] = useImmer({
      passive: {
         stat: '',
         multiplier: ''
      },
      active: {
         stat: '',
         multiplier: ''
      }
   })

   const onStatSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatName(e.target.value as StatNames)
   }
   const StatSelection = () => (
      <Select onChange={onStatSelection} value={statName}>
         <option value="none">Select stat</option>
         {statsTypes.map((stat, i) => (
            <option value={stat} key={i}>
               {_.startCase(stat)}
            </option>
         ))}
      </Select>
   )

   const onAddWeaponType = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStats({
         ...stat,
         weaponTypes: [...stat.weaponTypes, e.target.value as WeaponTypes].sort((a, b) => a.localeCompare(b))
      })
   }
   const onRemoveWeaponType = (weaponType: string) => {
      setStats({ ...stat, weaponTypes: _.without(stat.weaponTypes, weaponType as WeaponTypes) })
   }
   const notSelectedWeaponTypes = _.difference([...weaponTypes], [...stat.weaponTypes, 'other'])
   const WeaponTypeSelection = () => {
      return (
         <>
            <Select onChange={onAddWeaponType}>
               <option value="none">Select weapon type (optional)</option>
               {notSelectedWeaponTypes.map((weaponType, i) => (
                  <option value={weaponType} key={i}>
                     {weaponTypesToNames[weaponType]}
                  </option>
               ))}
            </Select>
            <div>
               {stat.weaponTypes.map((weaponType, i) => (
                  <div key={i} onClick={() => onRemoveWeaponType(weaponType)}>
                     {weaponTypesToNames[weaponType]}
                  </div>
               ))}
            </div>
         </>
      )
   }

   const addStatsNormal = () => {
      if (statName === 'none') {
         sendMessage(`Select stat first`, 'error')
         return
      }

      // check if where are stats with out weapon type
      // if where are prevent adding more
      const statsWithOutWeaponType = database[currentlySelected].stats?.[statName]?.filter(
         (stat) => stat.weaponTypes === undefined
      )
      if (statsWithOutWeaponType?.length && statsWithOutWeaponType?.length >= 1 && stat.weaponTypes.length === 0) {
         sendMessage(`Can't add more stats with out weapon type`, 'error')
         return
      }
      const newStats = {
         hash: currentlySelected,
         statName,
         stat
      }
      dispatch(addStat(newStats))
      setStats({
         active: {
            multiplier: [],
            stat: []
         },
         passive: {
            multiplier: [],
            stat: []
         },
         weaponTypes: []
      })
      setDisplayStats({
         passive: {
            stat: '',
            multiplier: ''
         },
         active: {
            stat: '',
            multiplier: ''
         }
      })
   }
   const addStatsEnhanced = () => {
      if (statName === 'none') return
      if (database[currentlySelected].linkedWith === undefined) return
      const newStats = {
         hash: database[currentlySelected].linkedWith!,
         statName,
         stat
      }
      dispatch(addStat(newStats))
      setStats({
         active: {
            multiplier: [],
            stat: []
         },
         passive: {
            multiplier: [],
            stat: []
         },
         weaponTypes: []
      })
      setDisplayStats({
         passive: {
            stat: '',
            multiplier: ''
         },
         active: {
            stat: '',
            multiplier: ''
         }
      })
   }

   // dose linked perk imports stats from selected perk?
   const linkedPerkImportsStats = Boolean(linkedWith && database[linkedWith]?.importStatsFrom === currentlySelected)

   const onAddStatImport = () => {
      if (linkedWith) {
         dispatch(
            setStatImport({
               addImportTo: linkedWith,
               importFrom: linkedPerkImportsStats ? 0 : currentlySelected
            })
         )
      }
   }

   return (
      <div>
         <Button onClick={() => setDisplay(!display)}>Add / Change stats</Button>
         {display && (
            <div>
               <div className={styles.selectionContainer}>
                  <ImportStats />
                  <StatSelection />
                  <WeaponTypeSelection />
               </div>
               <div>
                  <div className={styles.centeredText}>Passive</div>
                  <div className={styles.statInputContainer}>
                     <span>Stat</span>
                     <input
                        value={displayStats.passive.stat}
                        onChange={(e) => {
                           setStats((draft) => {
                              draft.passive.stat = statsStringToArray(e.target.value)
                           })
                           setDisplayStats((draft) => {
                              draft.passive.stat = e.target.value
                           })
                        }}
                     />
                     <span>Multiplier</span>
                     <input
                        value={displayStats.passive.multiplier}
                        onChange={(e) => {
                           setStats((draft) => {
                              draft.passive.multiplier = statsStringToArray(e.target.value)
                           })
                           setDisplayStats((draft) => {
                              draft.passive.multiplier = e.target.value
                           })
                        }}
                     />
                  </div>
                  <div className={styles.centeredText}>Conditional</div>
                  <div className={styles.statInputContainer}>
                     <span>Stat</span>
                     <input
                        value={displayStats.active.stat}
                        onChange={(e) => {
                           setStats((draft) => {
                              draft.active.stat = statsStringToArray(e.target.value)
                           })
                           setDisplayStats((draft) => {
                              draft.active.stat = e.target.value
                           })
                        }}
                     />
                     <span>Multiplier</span>
                     <input
                        value={displayStats.active.multiplier}
                        onChange={(e) => {
                           setStats((draft) => {
                              draft.active.multiplier = statsStringToArray(e.target.value)
                           })
                           setDisplayStats((draft) => {
                              draft.active.multiplier = e.target.value
                           })
                        }}
                     />
                  </div>
               </div>

               <Button onClick={addStatsNormal} title={`Adds stats to normal perk`}>
                  Add stats to normal perk
               </Button>

               {linkedWith !== undefined && globalState.settings.selectedType === 'weaponPerk' && (
                  <>
                     <Button onClick={addStatsEnhanced} title={`Adds stats to linked enhanced perk`}>
                        Add stats to enhanced perk
                     </Button>
                     <Button
                        onClick={onAddStatImport}
                        title={`If true enhanced perk will have same stats`}
                        buttonStatus={linkedPerkImportsStats}
                     >
                        {linkedPerkImportsStats ? 'Unlink stats from' : 'Link stats with'} enhanced perk
                     </Button>
                  </>
               )}
            </div>
         )}
         <StatsDisplay
            allowEdit={display}
            setDisplayStats={setDisplayStats}
            setStats={setStats}
            setStatName={setStatName}
         />
      </div>
   )
}
