import { Stat, StatNames, Stats, WeaponTypes } from '@icemourne/description-converter'
// import { useAppDispatch, useAppSelector } from 'src/redux/hooks'

// import { Button } from 'src/components/universal/Button'
// import { Updater } from 'use-immer'
// import { removeStat } from 'src/redux/globalSlice'
// import { statsToString } from 'src/utils/statsToStringAndBack'
// import styles from './StatDisplay.module.scss'

// interface DisplayStats {
//    passive: {
//       stat: string
//       multiplier: string
//    }
//    active: {
//       stat: string
//       multiplier: string
//    }
// }

// interface StatsArrays {
//    active: {
//       multiplier: number[]
//       stat: number[]
//    }
//    passive: {
//       multiplier: number[]
//       stat: number[]
//    }
//    weaponTypes: WeaponTypes[]
// }

// export function StatsDisplay({ 
//    allowEdit,
//    setDisplayStats,
//    setStats,
//    setStatName
// }: {
//    allowEdit: boolean
//    setDisplayStats: Updater<DisplayStats>
//    setStats: Updater<StatsArrays>
//    setStatName: React.Dispatch<React.SetStateAction<StatNames | 'none'>>
// }) {
//    const dispatch = useAppDispatch()
//    const { database } = useAppSelector((state) => state.global)

//    const selectedPerkHash = useAppSelector((state) => state.global.settings.currentlySelected)
//    const selectedPerk = database[selectedPerkHash]
//    const selectedPerkStats = selectedPerk.stats

//    const importedPerkHash = selectedPerk.importStatsFrom
//    const importedPerk = importedPerkHash ? database[importedPerkHash] : undefined
//    const importedPerkStats = importedPerk?.stats

//    const linkedPerks = selectedPerk.linkedWith

//    const linkedPerkStats = linkedPerks ? {
//       perkExotic: database[linkedPerks['Weapon Perk Exotic'] || 69]?.stats,
//       frameExotic: database[linkedPerks['Weapon Frame Exotic'] || 69]?.stats,
//       catalystExotic: database[linkedPerks['Weapon Catalyst Exotic'] || 69]?.stats,
//       perkEnhanced: database[linkedPerks['Weapon Perk Enhanced'] || 69]?.stats,
//       perk: database[linkedPerks['Weapon Perk'] || 69]?.stats,
//    } : undefined

//    const StatComponent = ({
//       stat,
//       statType,
//       displayName
//    }: {
//       stat: Stat
//       statType: 'active' | 'passive'
//       displayName: string
//    }) => {
//       return (
//          <>
//             <div className={styles.name}>{displayName}</div>
//             <div className={styles.statContainer}>
//                {stat?.[statType]?.stat && (
//                   <>
//                      <span>Stat</span>
//                      <span>{statsToString(stat?.[statType]?.stat)}</span>
//                   </>
//                )}
//                {stat?.[statType]?.multiplier && (
//                   <>
//                      <span>Multiplier</span>
//                      <span>{statsToString(stat?.[statType]?.multiplier)}</span>
//                   </>
//                )}
//             </div>
//          </>
//       )
//    }

//    const removeStats = (hash: number, statName: StatNames, index: number) => {
//       const stat = database[hash]?.stats?.[statName]?.[index]

//       setStatName(statName)

//       setStats((draft) => {
//          draft.weaponTypes = stat?.weaponTypes || []
//          draft.active.multiplier = stat?.active?.multiplier || []
//          draft.active.stat = stat?.active?.stat || []
//          draft.passive.multiplier = stat?.passive?.multiplier || []
//          draft.passive.stat = stat?.passive?.stat || []
//       })

//       setDisplayStats((draft) => {
//          draft.active = {
//             multiplier: statsToString(stat?.active?.multiplier),
//             stat: statsToString(stat?.active?.stat)
//          }
//          draft.passive = {
//             multiplier: statsToString(stat?.passive?.multiplier),
//             stat: statsToString(stat?.passive?.stat)
//          }
//       })

//       dispatch(removeStat({ hash, statName, index }))
//    }

//    const newStatListMaker = (stats: Stats, perkHash?: number) => {
//       const sortedStats = (Object.entries(stats) as [StatNames, Stat[]][]).sort(([a], [b]) => a.localeCompare(b))

//       const statValues = (stats: Stat[], statName: StatNames) =>
//          stats.map((stat, i) => (
//             <div className={styles.weaponTypeStat} key={i}>
//                {stat?.weaponTypes && (
//                   <div className={styles.weaponTypeList}>
//                      {stat.weaponTypes.map((weaponType, i, arr) => (
//                         <span key={i}>
//                            {weaponType}
//                            {i + 1 === arr.length ? '' : ','}
//                         </span>
//                      ))}
//                   </div>
//                )}
//                <div className={styles.statButton}>
//                   {allowEdit && perkHash && (
//                      <>
//                         <Button
//                            onClick={() => dispatch(removeStat({ hash: perkHash, statName, index: i }))}
//                            className={styles.removeButton}
//                         >
//                            Remove
//                         </Button>
//                         <Button onClick={() => removeStats(perkHash, statName, i)} className={styles.editButton}>
//                            Edit
//                         </Button>
//                      </>
//                   )}
//                   {stat.active && <StatComponent stat={stat} statType="active" displayName="Conditional" />}
//                   {stat.passive && <StatComponent stat={stat} statType="passive" displayName="Passive" />}
//                </div>
//             </div>
//          ))

//       return sortedStats.map(([statName, stats], i) => (
//          <div key={i} className={styles.singleStat}>
//             <div className={styles.statName}>{statName}</div>
//             {statValues(stats, statName)}
//          </div>
//       ))
//    }

//    // dose linked perk imports stats from selected perk?
//    const linkedImportsStats = undefined //linkedPerk?.importStatsFrom === selectedPerkHash

//    return (
//       <div className={styles.statDisplayContainer}>
//          {selectedPerkStats && (
//             <>
//                <div className={styles.name}>Perk stats {linkedImportsStats && '(Linked with enhanced)'}</div>
//                {newStatListMaker(selectedPerkStats, selectedPerkHash)}
//             </>
//          )}
//          {importedPerkStats && (
//             <>
//                <div className={styles.name}>Stats imported from {importedPerk.name}</div>
//                {newStatListMaker(importedPerkStats)}
//             </>
//          )}
//          {/* {selectedPerk.type === 'Weapon Perk' && linkedPerkStats && linkedPerks && (
//             <>
//                <div className={styles.name}>Stat on linked perk</div>
//                {newStatListMaker(linkedPerkStats, linkedPerks['Weapon Perk Enhanced'])}
//             </>
//          )} */}
//       </div>
//    )
// }
