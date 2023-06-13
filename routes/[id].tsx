import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$fresh/runtime.ts"
import { Menu } from "../components/Menu.tsx";
import { Item } from "../components/model/Item.ts";
import { selectItemById } from "../db/queries/Item.ts";
import { Database } from "../db/Database.ts";
import { parseBazosItem } from "../service/Bazos.ts";

export const handler: Handlers<Item> = {
  async GET(_, ctx) {
    const db = await new Database().init()
    let item = await selectItemById(db, parseInt(ctx.params.id))
    
    if (item === null) {
      throw new Error('Item ' + ctx.params.id + ' not found!')
    }

    item = parseBazosItem(db, item)

    return ctx.render(item)
  }
}

export default function Greet(props: PageProps<Item>) {
  return (
    <>
      <Head>
      <title>Bug Free Palm Tree Subaru app</title>
      </Head>
      <Menu></Menu>
      <div class="p-4 mx-auto max-w-screen-md">
        <h1>
          <a href={props.data.url} target="_blank" class="text-blue-600 cursor-pointer">
            {props.data.title}
          </a>
        </h1>
        <img src={props.data.main_image} alt="" />
        <p>{props.data.description}</p>
        <pre class="mt-5">{JSON.stringify({...props.data, description: '...'}, null, 2)}</pre>
      </div>
    </>
  )
}
