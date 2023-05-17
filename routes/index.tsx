import { Head } from "$fresh/runtime.ts"
import Counter from "../islands/Counter.tsx"
import { Handlers, PageProps } from "$fresh/server.ts"
import { Fragment } from "preact"
import { Menu } from "../components/Menu.tsx"
import { Database } from "../db/Database.ts"
import { selectAllItems } from "../db/queries/Item.ts"

interface Item {
  id: number
  title: string,
  url: string,
  site: string,
  description: string,
  is_active: boolean,
  main_image: string,
}

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
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the ./routes/index.tsx
          file, and refresh.
        </p>
        <Counter start={3} />
        <div class="flex flex-wrap -mx-2">
          {data.map(item => (
              <Fragment key={item.id}>
                <div class="w-1/4 px-2 pb-2">
                  <div className="p-1 border-solid rounded border-1">
                    <h2>{item.title}</h2>
                    <img src={item.main_image} alt="" />
                  </div>
                </div>
              </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
