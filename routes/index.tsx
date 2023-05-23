import { Head } from "$fresh/runtime.ts"
import { Handlers, PageProps } from "$fresh/server.ts"
import { Fragment } from "preact"
import { Menu } from "../components/Menu.tsx"
import { Database } from "../db/Database.ts"
import { selectAllItems } from "../db/queries/Item.ts"
import { Item } from "../components/model/Item.ts"

export const handler: Handlers<Array<Item>> = {
  async GET(_, ctx) {
    const db = await new Database().init()

    const items = await selectAllItems(db)
    // const { rows: users } = await client.execute(`select * from users`);
    // console.log(users);

    return ctx.render(items)
  }
}

export default function Home( {data}: PageProps<Array<Item>> ) {
  return (
    <>
      <Head>
        <title>Bug Free Palm Tree Subaru app</title>
      </Head>
      <Menu></Menu>
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <div class="flex flex-wrap -mx-2">
          {data.map(item => (
              <Fragment key={item.id}>
                <a class="w-1/4 px-2 pb-2" href={'/' + item.id}>
                  <div className="p-1 border-solid rounded border-1">
                    <h2>{item.title}</h2>
                    <img src={item.main_image} alt="" />
                  </div>
                </a>
              </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
