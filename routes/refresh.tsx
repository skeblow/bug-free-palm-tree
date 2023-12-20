import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$fresh/runtime.ts"
import { Menu } from "../components/Menu.tsx"
import { Item } from "../components/model/Item.ts"
import { Database } from "../db/Database.ts"
import { refresh} from '../service/Refresh.ts'

export const handler: Handlers<Array<Item>> = {
  async GET(_, ctx) {
    const db = await new Database().init()
    const allItems: Array<Item> = await refresh(db)

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
