import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$fresh/runtime.ts"
import { Menu } from "../components/Menu.tsx"
import { Item } from "../components/model/Item.ts"
import { Database } from "../db/Database.ts"
import { fetchAllBazos, fetchOneBazos } from "../service/Bazos.ts"
import { insertItem, selectItemByUrl, updateItem } from "../db/queries/Item.ts"

export const handler: Handlers<Array<Item>> = {
  async GET(_, ctx) {
    const db = await new Database().init()
    const items = await fetchAllBazos()
    const allItems: Array<Item> = []

    for (let item of items) {
      const found = await selectItemByUrl(db, item.url)

      if (found === null) {
        item = await insertItem(db, item)
      } else {
        item = found
      }

      if (item.description === '') {
        const itemDescription = await fetchOneBazos(item.url)
        item = {
          ...item,
          description: itemDescription.description,
        }

        await updateItem(db, item)
      }

      allItems.push(item)
    }

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
