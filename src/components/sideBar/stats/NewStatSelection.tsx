import { StringStat, StringStats, statsToString } from 'src/utils/statsToStringAndBack'
import { Updater, useImmer } from 'use-immer'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'

import { StatNames } from '@icemourne/description-converter'
import { TypedObject } from 'src/utils/typedObjects'
import _ from 'lodash'
import styles from './NewStatSelection.module.scss'
import { useEffect } from 'react'

const StatValues = ({
   stat,
   statType,
   editMode = true
}: {
   stat: StringStat
   statType: 'active' | 'passive'
   editMode?: boolean
}) => {
   const showStats = {
      active: stat?.[statType]?.stat || !editMode,
      passive: stat?.[statType]?.multiplier || !editMode
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

const StatComponent = ({ stats, editMode = true }: { stats: StringStat[], editMode?: boolean}) => {
   const revereStats = stats.slice(0).reverse()

   return (
      <>
         {revereStats.map((stat, i) => (
            <div key={i}>
               {stat?.weaponTypes && (
                  <div>
                     {stat.weaponTypes
                        .map((weaponType, i, arr) => `${_.upperFirst(weaponType)}${i + 1 === arr.length ? '' : ', '}`)
                        .join('')}
                  </div>
               )}
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
      <div className={styles.statsTest}>
         <div className={styles.statUpdater}>
            {TypedObject.entries(displayStats).map(([statName, stat]) => (
               <div key={statName} className={styles.stat}>
                  {/* <div className={styles.statName}>{_.startCase(statName)}</div> */}
                  <StatComponent stats={stat} editMode={false} />
               </div>
            ))}
         </div>
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
         {statEditStatus && <StatUpdater displayStats={displayStats} setDisplayStats={setDisplayStats} />}
         {TypedObject.entries(displayStats).map(([statName, stat]) => (
            <div key={statName} className={styles.stat} onClick={() => setStatEditStatus((c) => !c)}>
               <div className={styles.statName}>{_.startCase(statName)}</div>
               <StatComponent stats={stat} />
            </div>
         ))}
      </div>
   )
}
