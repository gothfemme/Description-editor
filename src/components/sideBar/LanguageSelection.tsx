import { Languages } from '@icemourne/description-converter'
import { Select } from '../universal/Select'
import { changeLanguage } from 'src/redux/globalSlice'
import { languages } from 'src/data/randomData'
import styles from './LanguageSelection.module.scss'
import { useAppDispatch } from 'src/redux/hooks'

export function LanguageSelection() {
   const dispatch = useAppDispatch()

   const onLanguageChange = (language: Languages) => {
      dispatch(changeLanguage(language))
   }

   return (
      <Select className={styles.selection} onChange={(e) => onLanguageChange(e.target.value as Languages)}>
         {languages.map((language, i) => (
            <option value={language[0]} key={i}>{language[1]}</option>
         ))}
      </Select>
   )
}
