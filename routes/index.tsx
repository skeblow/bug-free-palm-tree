import { Head } from "$fresh/runtime.ts"
import { Handlers, PageProps } from "$fresh/server.ts"
import { Fragment } from "preact"
import { Menu } from "../components/Menu.tsx"
import { Database } from "../db/Database.ts"
import { selectAllItems, selectItemFilter } from "../db/queries/Item.ts"
import { Item } from "../components/model/Item.ts"
import { ItemFilter } from "../components/model/ItemFilter.ts"
import { selectSetting } from '../db/queries/Setting.ts'
import { refresh} from '../service/Refresh.ts'

export const handler: Handlers<IndexProps> = {
  async GET(req, ctx) {
    const db = await new Database().init()

    const lastRefresh = await selectSetting(db, 'last_refresh')

    // miliseconds
    const lastRefreshDiff = new Date().getTime() - new Date(lastRefresh).getTime()

    // hour ago
    if (lastRefreshDiff > 60 * 60 * 1_000) {
      console.log('refresh start')
      const items = await refresh(db)
      console.log('fetched', items.length)
      console.log('refresh end')
    }

    const url = new URL(req.url)

    const activeFilter: ItemFilter = {
      models: url.searchParams.getAll('model[]'),
      engines: url.searchParams.getAll('engine[]'),
      year_from: parseInt(url.searchParams.get('year_from') ?? '0'),
      year_to: parseInt(url.searchParams.get('year_to') ?? '0'),
    }

    const filter = await selectItemFilter(db)
    const items = await selectAllItems(db, activeFilter)

    return ctx.render({
      items,
      filter,
      activeFilter,
      lastRefresh,
    })
  }
}

interface IndexProps {
  items: Array<Item>
  filter: ItemFilter
  activeFilter: ItemFilter,
  lastRefresh: string,
}

export default function Home( {data}: PageProps<IndexProps> ) {
  return (
    <>
      <Head>
        <title>Bug Free Palm Tree Subaru app</title>
      </Head>
      <Menu></Menu>
      <div class="p-4 mx-auto max-w-screen-md">
        <p class="mb-3 pb-2 border-b-1">
          Last update: {data.lastRefresh} 
          <a href="/refresh" class="ml-2 bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2">Update now</a>
        </p>
  
        <form action="/" method="get" class="mb-4">
          <div class="flex flex-wrap mb-2">
            <div class="w-1/2 lg:w-1/4">
              Models:
              {data.filter.models.map(model => (
                <Fragment key={model}>
                  <label class="block px-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="model[]" 
                      value={model}
                      checked={data.activeFilter.models.includes(model)} 
                      class="mr-1"
                    />
                    {model}
                  </label>
                </Fragment>
              ))}
            </div>
            <div class="w-1/2 lg:w-1/4">
              Engines:
              {data.filter.engines.map(engine => (
                <Fragment key={engine}>
                  <label class="block px-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="engine[]" 
                      value={engine}
                      checked={data.activeFilter.engines.includes(engine)} 
                      class="mr-1"
                    />
                    {engine}
                  </label>
                </Fragment>
              ))}
            </div>
            <div class="w-1/2 lg:w-1/4">
              Year from:
              <div>
                <input 
                  type="number" 
                  class="w-1/2 border-solid border-1 rounded p-1"
                  min={data.filter.year_from} 
                  value={data.activeFilter.year_from !== 0 ? data.activeFilter.year_from : data.filter.year_from} 
                  name="year_from" 
                />
               </div>
            </div>
            <div class="w-1/2 lg:w-1/4">
              Year to:
              <div>
                <input 
                  type="number"
                  class="w-1/2 border-solid border-1 rounded p-1"
                  min={data.filter.year_to} 
                  value={data.activeFilter.year_to !== 0 ? data.activeFilter.year_to : data.filter.year_to} 
                  name="year_to" 
                />
              </div>
            </div>
          </div>
          <button type="submit" class="bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2">Filter</button>
          <a href="/" class="bg-red-500 text-white font-bold py-1 px-2 rounded inline-block">Reset</a>
        </form>

        <div class="flex flex-wrap -mx-2">
          {data.items.map(item => (
            <Fragment key={item.id}>
              <a class="w-1/2 lg:w-1/4 px-2 pb-2" href={'/' + item.id}>
                <div className="p-1 border-solid rounded border-1">
                  <h2>{item.title}</h2>
                  <img src={item.main_image} alt="" />
                  <div>{item.mileage ?? '?'} km</div>
                  <div>{Intl.NumberFormat().format(item.price ?? 0)} Kc</div>
                </div>
              </a>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
