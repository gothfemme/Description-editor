import { useAppDispatch } from '@redux/hooks'
import { Languages } from '@redux/interfaces'
import { changeLanguage } from '@redux/globalSlice'
import styles from './LanguageSelection.module.scss'
import { Select } from '@components/universal/Select'
import { languages } from '@data/randomData'

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
