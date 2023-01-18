import { StatNames, WeaponTypes, weaponTypes } from '@icemourne/description-converter'
import { StringStat, StringStats, statsToString } from 'src/utils/statsToStringAndBack'
import { Updater, useImmer } from 'use-immer'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'

import { Button } from 'src/components/universal/Button'
import { TypedObject } from '@icemourne/tool-box'
import _ from 'lodash'
import styles from './NewStatSelection.module.scss'
import { useEffect } from 'react'

const StatValues = ({
   stat,
   statType,
   editMode = false
}: {
   stat: StringStat
   statType: 'active' | 'passive'
   editMode?: boolean
}) => {
   const showStats = {
      active: stat?.[statType]?.stat || editMode,
      passive: stat?.[statType]?.multiplier || editMode
   }
   return (
      <>
         {showStats.active && (
            <div className={styles.statValue}>
               <span>Stat - {statType}</span>
               <input value={stat?.[statType]?.stat || ''} readOnly={editMode}></input>
            </div>
         )}
         {showStats.passive && (
            <div className={styles.statValue}>
               <span>Multiplier - {statType}</span>
               <input value={stat?.[statType]?.multiplier || ''} readOnly={editMode}></input>
            </div>
         )}
      </>
   )
}

const StatComponent = ({
   stats,
   setDisplayStats,
   editMode = false
}: {
   stats: StringStat[]
   setDisplayStats?: Updater<StringStats>
   editMode?: boolean
}) => {
   const weaponTypesComponent = (stat: StringStat) => {
      if (!stat?.weaponTypes) return null

      return (
         <div className={styles.weaponTypes}>
            {stat.weaponTypes.map(
               ([weaponType, selected], i, arr) =>
                  (editMode || selected) && (
                     <span key={i}>{`${_.upperFirst(weaponType)}${','}`}</span>
                  )
            )}
         </div>
      )
   }

   return (
      <>
         {stats.map((stat, i) => (
            <div key={i}>
               {weaponTypesComponent(stat)}
               <div className={styles.statValues}>
                  {stat.active && <StatValues stat={stat} statType="active" editMode={editMode} />}
                  {stat.passive && <StatValues stat={stat} statType="passive" editMode={editMode} />}
               </div>
            </div>
         ))}
      </>
   )
}

const StatUpdater = ({
   displayStats,
   setDisplayStats
}: {
   displayStats: StringStats
   setDisplayStats: Updater<StringStats>
}) => {
   return (
      <div className={styles.statUpdater}>
         {TypedObject.entries(displayStats).map(([statName, stat]) => (
            <div key={statName} className={styles.stat}>
               <div className={styles.statName}>{_.startCase(statName)}</div>
               <div>
                  <StatComponent stats={stat} setDisplayStats={setDisplayStats} editMode={true} />
               </div>
            </div>
         ))}
         <Button onClick={() => {}}> add stats</Button>
      </div>
   )
}

export function NewStatSelection() {
   const { database, settings } = useAppSelector((state) => state.global)
   const dispatch = useAppDispatch()

   const { currentlySelected } = settings

   const { linkedWith, stats } = database[currentlySelected]

   const [displayStats, setDisplayStats] = useImmer(statsToString(stats))
   useEffect(() => setDisplayStats(statsToString(stats)), [currentlySelected])

   const [statEditStatus, setStatEditStatus] = useImmer(false)

   return (
      <div className={styles.stats}>
         <Button onClick={() => setStatEditStatus((c) => !c)}>Edit</Button>
         {statEditStatus && <StatUpdater displayStats={displayStats} setDisplayStats={setDisplayStats} />}
         {TypedObject.entries(displayStats).map(([statName, stat]) => (
            <div key={statName} className={styles.stat}>
               <div className={styles.statName}>{_.startCase(statName)}</div>
               <StatComponent stats={stat} />
            </div>
         ))}
      </div>
   )
}
