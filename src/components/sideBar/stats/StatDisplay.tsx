import { Button } from '@components/universal/Button'
import { weaponTypesToNames } from '@data/randomData'
import { removeStat } from '@redux/globalSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { Stat, StatNames, Stats, WeaponTypes } from '@redux/interfaces'
import { statsArrayToString } from '@utils/statsToStringAndBack'
import _ from 'lodash'
import { Updater } from 'use-immer'
import styles from './StatDisplay.module.scss'

interface DisplayStats {
   passive: {
      stat: string
      multiplier: string
   }
   active: {
      stat: string
      multiplier: string
   }
}

interface StatsArrays {
   active: {
      multiplier: number[]
      stat: number[]
   }
   passive: {
      multiplier: number[]
      stat: number[]
   }
   weaponTypes: WeaponTypes[]
}

export function StatsDisplay({
   allowEdit,
   setDisplayStats,
   setStats,
   setStatName
}: {
   allowEdit: boolean
   setDisplayStats: Updater<DisplayStats>
   setStats: Updater<StatsArrays>
   setStatName: React.Dispatch<React.SetStateAction<StatNames | 'none'>>
}) {
   const dispatch = useAppDispatch()
   const database = useAppSelector((state) => state.global.database)

   const selectedPerkHash = useAppSelector((state) => state.global.settings.currentlySelected)
   const selectedPerk = database[selectedPerkHash]
   const selectedPerkStats = selectedPerk.stats

   const importedPerkHash = selectedPerk.importStatsFrom
   const importedPerk = importedPerkHash ? database[importedPerkHash] : undefined
   const importedPerkStats = importedPerk?.stats

   const linkedPerkHash = selectedPerk.linkedWith
   const linkedPerk = linkedPerkHash ? database[linkedPerkHash] : undefined
   const linkedPerkStats = linkedPerk?.stats

   const Stat = ({
      stat,
      statType,
      displayName
   }: {
      stat: Stat
      statType: 'active' | 'passive'
      displayName: string
   }) => {
      return (
         <>
            <div className={styles.name}>{displayName}</div>
            <div className={styles.statContainer}>
               {stat?.[statType]?.stat && (
                  <>
                     <span>Stat</span>
                     <span>{statsArrayToString(stat?.[statType]?.stat)}</span>
                  </>
               )}
               {stat?.[statType]?.multiplier && (
                  <>
                     <span>Multiplier</span>
                     <span>{statsArrayToString(stat?.[statType]?.multiplier)}</span>
                  </>
               )}
            </div>
         </>
      )
   }

   const moveStats = (hash: number, statName: StatNames, index: number) => {
      const stat = database[hash]?.stats?.[statName]?.[index]

      setStatName(statName)

      setStats((draft) => {
         draft.weaponTypes = stat?.weaponTypes || []
         draft.active.multiplier = stat?.active?.multiplier || []
         draft.active.stat = stat?.active?.stat || []
         draft.passive.multiplier = stat?.passive?.multiplier || []
         draft.passive.stat = stat?.passive?.stat || []
      })

      setDisplayStats((draft) => {
         draft.active = {
            multiplier: statsArrayToString(stat?.active?.multiplier),
            stat: statsArrayToString(stat?.active?.stat)
         }
         draft.passive = {
            multiplier: statsArrayToString(stat?.passive?.multiplier),
            stat: statsArrayToString(stat?.passive?.stat)
         }
      })

      dispatch(removeStat({ hash, statName, index }))
   }

   const newStatListMaker = (stats: Stats, perkHash?: number) => {
      return (Object.entries(stats) as [StatNames, Stat[]][])
         .sort(([a], [b]) => a.localeCompare(b))
         .map(([statName, stats], i) => (
            <div key={i} className={styles.singleStat}>
               <div className={styles.statName}>{_.startCase(statName)}</div>
               {stats.map((stat, i) => (
                  <div className={styles.weaponTypeStat} key={i}>
                     {stat?.weaponTypes && (
                        <div className={styles.weaponTypeList}>
                           {stat.weaponTypes.map((weaponType, i, arr) => (
                              <span key={i}>
                                 {weaponTypesToNames[weaponType]}
                                 {i + 1 === arr.length ? '' : ','}
                              </span>
                           ))}
                        </div>
                     )}
                     <div className={styles.statButton}>
                        {allowEdit && perkHash && (
                           <>
                              <Button
                                 onClick={() => dispatch(removeStat({ hash: perkHash, statName, index: i }))}
                                 className={styles.removeButton}
                              >
                                 Remove
                              </Button>
                              <Button onClick={() => moveStats(perkHash, statName, i)} className={styles.editButton}>
                                 Edit
                              </Button>
                           </>
                        )}
                        {stat.active && <Stat stat={stat} statType="active" displayName="Conditional" />}
                        {stat.passive && <Stat stat={stat} statType="passive" displayName="Passive" />}
                     </div>
                  </div>
               ))}
            </div>
         ))
   }

   // dose linked perk imports stats from selected perk?
   const linkedImportsStats = linkedPerk?.importStatsFrom === selectedPerkHash

   return (
      <div className={styles.statDisplayContainer}>
         {selectedPerkStats && (
            <>
               <div className={styles.name}>Perk stats {linkedImportsStats && '(Linked with enhanced)'}</div>
               {newStatListMaker(selectedPerkStats, selectedPerkHash)}
            </>
         )}
         {importedPerkStats && (
            <>
               <div className={styles.name}>Stats imported from {importedPerk.name}</div>
               {newStatListMaker(importedPerkStats)}
            </>
         )}
         {selectedPerk.type === 'weaponPerk' && linkedPerkStats && linkedPerkHash && (
            <>
               <div className={styles.name}>Stat on linked perk</div>
               {newStatListMaker(linkedPerkStats, linkedPerkHash)}
            </>
         )}
      </div>
   )
}
