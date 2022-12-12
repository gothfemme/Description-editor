import { sendMessage } from '@utils/sendMessage'

interface InventoryItem {
   displayProperties: {
      name: string
      description: string
      icon: string
      hasIcon: boolean
   }
   inventory: {
      tierType: number
   }
   plug: {
      plugCategoryHash: number
   }
   itemTypeDisplayName: string
   itemCategoryHashes: number[]
   itemType: number
   investmentStats: {
      statTypeHash: number
      value: number
      isConditionallyActive: boolean
   }[]
}

async function getInvItemFromBungie(manifest: any) {
   return await fetch(
      `https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition}`
   ).then((invItemResp) => invItemResp.json())
}

export async function getManifest() {
   let ignoreVersion = false

   let manifestResp = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest/')

   if (manifestResp.status !== 200) manifestResp = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest/')
   if (manifestResp.status !== 200) manifestResp = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest/')
   if (manifestResp.status !== 200) {
      ignoreVersion = true
      sendMessage('Failed to get manifest\nMaybe Bungie sever down?', 'error')
   }

   const manifest = await manifestResp.json()

   const manifestData = await new Promise((resolve) => {
      if (localStorage.getItem('manifest-version') !== manifest.Response?.version || ignoreVersion) {
         localStorage.setItem('manifest-version', manifest.Response.version)

         getInvItemFromBungie(manifest).then((invItem) => {
            resolve(invItem)

            try {
               const idb1 = window.indexedDB.open('manifestStore')
               idb1.onupgradeneeded = (e) => {
                  try {
                     // @ts-ignore
                     const db = e.target.result
                     db.createObjectStore('manifest')
                  } catch {
                     localStorage.removeItem('manifest-version')
                  }
               }

               const idb2 = window.indexedDB.open('manifestStore')
               idb2.onsuccess = (e) => {
                  try {
                     // @ts-ignore
                     const db = e.target.result
                     const tx = db.transaction('manifest', 'readwrite')
                     const st = tx.objectStore('manifest')
                     st.put(invItem, 'manifest')
                  } catch {
                     localStorage.removeItem('manifest-version')
                  }
               }
            } catch {
               localStorage.removeItem('manifest-version')
            }
         })
      } else {
         try {
            const idb = window.indexedDB.open('manifestStore')
            idb.onsuccess = (e) => {
               try {
                  // @ts-ignore
                  const db: IDBDatabase = e.target.result
                  const tx = db.transaction('manifest', 'readwrite')
                  const store = tx.objectStore('manifest')
                  const data = store.get('manifest')
                  data.onsuccess = () => resolve(data.result)
               } catch {
                  getInvItemFromBungie(manifest).then((invItem) => {
                     resolve(invItem)
                  })
                  localStorage.removeItem('manifest-version')
               }
            }
         } catch {
            getInvItemFromBungie(manifest).then((invItem) => {
               resolve(invItem)
            })
            localStorage.removeItem('manifest-version')
         }
      }
   })
   return manifestData as { [key: string]: InventoryItem }
}
