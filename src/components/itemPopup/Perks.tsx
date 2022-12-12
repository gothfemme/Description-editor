import convertDescription from '@descriptionConverter/convertDescription'
import { descriptionFilter } from '@descriptionConverter/descriptionFilter'
import { useAppSelector } from '@redux/hooks'
import { getPerk } from '@redux/reducers/dataBase'
import { cnc } from '@utils/classNameCombiner'
import { DescriptionBuilder } from './Description'
import styles from './Perks.module.scss'

import { getManifest } from '@data/bungieManifest'
import betaDimLogo from "../../assets/betaDimLogo.png"
import clarityLogo from "../../assets/clarityLogo.png"

const bungieManifest = await getManifest()

export function Perks() {
   const langue = useAppSelector((state) => state.global.settings.language)
   const perk = getPerk()

   const mainDescription = convertDescription(perk.editor[langue]?.main || '', 'main')
   const secondaryDescription = descriptionFilter(
      convertDescription(perk.editor[langue]?.secondary || '', 'secondary'),
      'dim'
   )

   const perkIcon = bungieManifest[perk.hash]?.displayProperties.icon


   return (
      <div className={styles.perk_box}>
         <div className={styles.perk_list}>
            <div className={styles.description}>
               <DescriptionBuilder description={mainDescription || []} />
            </div>
            <div className={cnc(styles.perk, styles.perk_active)}>
               <div className={cnc(styles.icon_container_borderless)}>
                  <img src={perkIcon ? `https://bungie.net${perkIcon}` : clarityLogo} />
               </div>
               <div className={cnc(styles.name, styles.name_active)}>{perk.name}</div>
            </div>
         </div>
         <div className={styles.perk_list}>
            <div className={styles.description}>
               <DescriptionBuilder description={secondaryDescription || []} />
            </div>
            <div className={cnc(styles.perk, styles.perk_active)}>
               <div className={cnc(styles.icon_container_borderless)}>
                  <img src={betaDimLogo} />
               </div>
               <div className={cnc(styles.name, styles.name_active)}>{perk.name}</div>
            </div>
         </div>
         <div className={styles.perk_list}>
            <div className={cnc(styles.perk, styles.perk_active)}>
               <div className={cnc(styles.icon_container, styles.icon_container_active)}>
                  <img src="https://bungie.net/common/destiny2_content/icons/f2ff6ea4498ad2d808b4af21e93cf5fe.png" />
               </div>
               <div className={cnc(styles.name, styles.name_active)}>{perk.name}</div>
            </div>
         </div>
         <div className={styles.perk_list}>
            <div className={cnc(styles.perk, styles.perk_active)}>
               <div className={cnc(styles.icon_container, styles.icon_container_active)}>
                  <img src="https://bungie.net/common/destiny2_content/icons/f2ff6ea4498ad2d808b4af21e93cf5fe.png" />
               </div>
               <div className={cnc(styles.name, styles.name_active)}>{perk.name}</div>
            </div>
         </div>
      </div>
   )
}
