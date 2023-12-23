import { Item } from "../components/model/Item.ts"
import { Database } from "../db/Database.ts"
import { fetchAllBazos, fetchOneBazos } from "../service/Bazos.ts"
import { deleteInactiveItems, insertItem, selectItemByUrl, updateAllItemsIsActive, updateItem } from "../db/queries/Item.ts"
import { updateSetting } from '../db/queries/Setting.ts'
import { fetchAllAwd, fetchOneAwd } from "../service/Awd.ts"
import { fetchAllSportovnivozy } from "../service/Sportovnivozy.ts"
import { fetchAllBazar } from "../service/Bazar.ts"
import { fetchAllSauto } from "../service/Sauto.ts"
import { parseItem } from "../service/Parse.ts"

export async function refresh (db: Database): Promise<Array<Item>> {
  const allItems: Array<Item> = []

  updateAllItemsIsActive(db, false)

  updateSetting(
    db,
    'last_refresh',
    getNowString(),
  )

  let items: Array<Item> = []

  items = items.concat(await fetchAllBazos())
  items = items.concat(await fetchAllAwd())
  items = items.concat(await fetchAllBazar())
  items = items.concat(await fetchAllSauto())
  items = items.concat(await fetchAllSportovnivozy())

  for (let item of items) {
    const foundItem = await selectItemByUrl(db, item.url)

    if (foundItem === null) {
      item = await insertItem(db, item)
    } else {
      item = foundItem
    }

    item = {
      ...item,
      is_active: true,
    }

    if (item.site === 'bazos') {
      if (item.description === '') {
        const fetchedItem = await fetchOneBazos(item.url)
        item = {
          ...item,
          description: fetchedItem.description,
          price: fetchedItem.price,
        }
      }
    }

    item = parseItem(item)

    if (item.site === 'awd' && ! item.is_parsed) {
      const fetchedItem = await fetchOneAwd(item.url)

      item = {
        ...item,
        engine: fetchedItem.engine,
        power: fetchedItem.power,
        is_automat: fetchedItem.is_automat,
      }
    }

    await updateItem(db, item)

    allItems.push(item)
  }

  deleteInactiveItems(db)

  return allItems
}

function getNowString (): string {
  const date = new Date()

  const year = String(date.getFullYear())
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}