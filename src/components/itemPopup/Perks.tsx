import { DescriptionData, descriptionConverter, descriptionFilter } from '@icemourne/description-converter'

import { DescriptionBuilder } from './Description'
import betaDimLogo from '../../assets/betaDimLogo.png'
import clarityLogo from '../../assets/clarityLogo.png'
import { cnc } from 'src/utils/classNameCombiner'
import { getPerk } from 'src/redux/reducers/dataBase'
import styles from './Perks.module.scss'
import { useAppSelector } from 'src/redux/hooks'

export function Perks() {
   const globalState = useAppSelector((state) => state.global)
   const langue = globalState.settings.language
   const perk = getPerk()

   const perkIcon = globalState.bungie.inventoryItem?.[perk.hash]?.displayProperties?.icon

   const descriptionDataMain: DescriptionData = {
      descriptionString: perk.editor[langue]?.main || '',
      editorType: 'main',
      language: langue,
      hash: perk.hash,
      database: globalState.database
   }
   const descriptionDataSecondary: DescriptionData = {
      descriptionString: perk.editor[langue]?.secondary || '',
      editorType: 'secondary',
      language: langue,
      hash: perk.hash,
      database: globalState.database
   }

   const mainDescription = descriptionConverter(descriptionDataMain)
   const secondaryDescription = descriptionFilter(descriptionConverter(descriptionDataSecondary), 'dim')


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
