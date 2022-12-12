import { useAppSelector } from '@redux/hooks'
import styles from './Message.module.scss'

export function Message() {
   const messages = useAppSelector((state) => state.global.settings.messages)
   return (
      <div className={styles.message}>
         {messages.map((message, i) => (
            <span key={i} className={message.type && styles[message.type]}>
               {message.message}
            </span>
         ))}
      </div>
   )
}
