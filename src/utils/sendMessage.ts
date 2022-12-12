import { addMessage, removeLastMessage } from "@redux/globalSlice";
import { store } from "@redux/store";

export function sendMessage(message: string, type?: 'error' | 'success') {
   store.dispatch(addMessage({message, type}))
   setTimeout(()=> {
      store.dispatch(removeLastMessage())
   }, 15000)
}