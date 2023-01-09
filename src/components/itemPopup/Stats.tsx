import React from 'react'
import Recoil from 'src/assets/svg/Recoil'
import styles from './Stats.module.scss'

export function Stats() {
   // prettier-ignore
   const weaponStats = [
      { statBarPlace: null,       name: 'Rounds Per Minute', value: 360 },
      { statBarPlace: 'stat_bar', name: 'Impact',            value: 33  },
      { statBarPlace: 'stat_bar', name: 'Range',             value: 79  },
      { statBarPlace: 'stat_bar', name: 'Stability',         value: 30  },
      { statBarPlace: 'stat_bar', name: 'Handling',          value: 55  },
      { statBarPlace: 'stat_bar', name: 'Reload Speed',      value: 45  },
      { statBarPlace: 'stat_bar', name: 'Aim Assistance',    value: 52  },
      { statBarPlace: 'stat_svg', name: 'Recoil Direction',  value: 86  },
      { statBarPlace: null,       name: 'Magazine',          value: 32  }
   ]

   return (
      <div className={styles.stats}>
         {weaponStats.map((stat, i) => (
            <React.Fragment key={i}>
               <div className={styles.name}>{stat.name}</div>
               <div className={styles.value}>{stat.value}</div>
               {stat.statBarPlace === 'stat_bar' ? (
                  <div className={styles.barr}>
                     <div style={{ width: `${stat.value}%` }}></div>
                  </div>
               ) : (
                  stat.statBarPlace === 'stat_svg' && <Recoil recoilStat={stat.value} />
               )}
            </React.Fragment>
         ))}
      </div>
   )
}
