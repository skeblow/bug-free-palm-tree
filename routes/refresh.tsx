import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$fresh/runtime.ts"
import { Menu } from "../components/Menu.tsx"
import { Item } from "../components/model/Item.ts"
import { Database } from "../db/Database.ts"
import { fetchAllBazos, fetchOneBazos, parseBazosItem } from "../service/Bazos.ts"
import { deleteInactiveItems, insertItem, selectItemByUrl, updateAllItemsIsActive, updateItem } from "../db/queries/Item.ts"
import { fetchAllAwd, fetchOneAwd } from "../service/Awd.ts"
import { fetchAllSportovnivozy } from "../service/Sportovnivozy.ts"
import { fetchAllBazar } from "../service/Bazar.ts"
import { fetchAllSauto } from "../service/Sauto.ts"

export const handler: Handlers<Array<Item>> = {
  async GET(_, ctx) {
    const db = await new Database().init()
    const allItems: Array<Item> = []
    
    updateAllItemsIsActive(db, false)

    let items: Array<Item> = []

    items = items.concat(await fetchAllBazos())
    items = items.concat(await fetchAllAwd())
    items = items.concat(await fetchAllSportovnivozy())
    items = items.concat(await fetchAllBazar())
    items = items.concat(await fetchAllSauto())

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

      item = parseBazosItem(db, item)

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

    return ctx.render(allItems)
  }
}

export default function Refresh({ data }: PageProps<Array<Item>>) {
  return (
    <>
      <Head>
        <title>Bug Free Palm Tree Subaru app</title>
      </Head>
      <Menu></Menu>

      <div class="p-4 mx-auto max-w-screen-md">
        fetched {data.length} items
      </div>
    </>
  )
}
