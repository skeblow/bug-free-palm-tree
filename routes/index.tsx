import { Head } from "$fresh/runtime.ts"
import { Handlers, PageProps } from "$fresh/server.ts"
import { Fragment } from "preact"
import { Menu } from "../components/Menu.tsx"
import { Database } from "../db/Database.ts"
import { selectAllItems, selectItemFilter } from "../db/queries/Item.ts"
import { Item } from "../components/model/Item.ts"
import { ItemFilter } from "../components/model/ItemFilter.ts"

export const handler: Handlers<IndexProps> = {
  async GET(_, ctx) {
    const db = await new Database().init()

    const items = await selectAllItems(db)
    const filter = await selectItemFilter(db)

    return ctx.render({
      items,
      filter,
    })
  }
}

interface IndexProps {
  items: Array<Item>
  filter: ItemFilter
}

export default function Home( {data}: PageProps<IndexProps> ) {
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

        <div class="flex mb-4">
          <div class="w-1/4">
            Models:
            {data.filter.models.map(model => (
              <Fragment key={model}>
                <label class="block px-2">
                  <input type="checkbox" name="model[]" value={model} class="mr-1" />
                  {model}
                </label>
              </Fragment>
            ))}
          </div>
          <div class="w-1/4">
            Engines:
            {data.filter.engines.map(engine => (
              <Fragment key={engine}>
                <label class="block px-2">
                  <input type="checkbox" name="engine[]" value={engine} class="mr-1" />
                  {engine}
                </label>
              </Fragment>
            ))}
          </div>
          <div class="w-1/4">
            Year from:
            <div>
              {data.filter.year_from}
            </div>
          </div>
          <div class="w-1/4">
          Year to:
            <div>
              {data.filter.year_to}
            </div>
          </div>
        </div>

        <div class="flex flex-wrap -mx-2">
          {data.items.map(item => (
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
