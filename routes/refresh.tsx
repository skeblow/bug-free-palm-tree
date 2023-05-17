import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$fresh/runtime.ts"
import { Menu } from "../components/Menu.tsx"
import { Item } from "../components/model/Item.ts"
import { Database } from "../db/Database.ts"
import { fetchBazos } from "../service/Bazos.ts"
import { insertItem } from "../db/queries/Item.ts"

export const handler: Handlers<Array<Item>> = {
  async GET(_, ctx) {
    const db = await new Database().init()

    const items = await fetchBazos()

    for (const item of items) {
      await insertItem(db, item)
    }

    return ctx.render(items)
  }
}

export default function Refresh(props: PageProps<Array<Item>>) {
  return (
    <>
      <Head>
        <title>Bug Free Palm Tree Subaru app</title>
      </Head>
      <Menu></Menu>

      <div class="p-4 mx-auto max-w-screen-md">
        asd
      </div>
    </>
  )
}
