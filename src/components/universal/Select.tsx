import { cnc } from '@utils/classNameCombiner'
import styles from './Select.module.scss'

export function Select({
   children,
   onChange,
   value,
   className = ''
}: {
   children: React.ReactNode
   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
   value?: string | number
   className?: string
   name?: string
}) {
   return (
      <select className={cnc(styles.select, className)} onChange={(e) => onChange(e)} value={value}>
         {children}
      </select>
   )
}
