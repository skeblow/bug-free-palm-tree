import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$fresh/runtime.ts"
import { Menu } from "../components/Menu.tsx"
import { Item } from "../components/model/Item.ts"
import { Database } from "../db/Database.ts"

export const handler: Handlers<Array<Item>> = {
  async GET(_, ctx) {
    const db = await new Database().init()

    await db.migrate()

    return ctx.render()
  }
}

export default function Migrations({ data }: PageProps<void>) {
  return (
    <>
      <Head>
        <title>Bug Free Palm Tree Subaru app</title>
      </Head>
      <Menu></Menu>

      <div class="p-4 mx-auto max-w-screen-md">
        done
      </div>
    </>
  )
}
