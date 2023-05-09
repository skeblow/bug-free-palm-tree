import { Head } from "$fresh/runtime.ts"
import Counter from "../islands/Counter.tsx"
import { Handlers, PageProps } from "$fresh/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"
import { Client } from "https://deno.land/x/mysql/mod.ts"
import { Node } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { Fragment } from "preact";

interface Item {
  id: number
  title: string,
  url: string,
  site: string,
  description: string,
  is_active: boolean,
  main_image: string,
}

async function fetchBazos(): Promise<Array<Item>> {
  const url = 'https://auto.bazos.cz/?hledat=subaru+forester+xt&rubriky=auto&hlokalita=&humkreis=25&cenaod=50000&cenado=300000&Submit=Hledat&kitx=ano';

  const response = await fetch(url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  if (doc === null) {
    return []
  }

  return (Array.from(doc.querySelectorAll('.maincontent .inzeraty')))
    .map(
      (el: Node, i: number): Item => {
        const listing = el as unknown as HTMLElement

        const title = listing.querySelector('.nadpis')?.textContent ?? ''
        const url = listing.querySelector('.nadpis a')?.getAttribute('href') ?? ''
        const description = listing.querySelector('.popis')?.textContent ?? ''
        const mainImage = listing.querySelector('.obrazek')?.getAttribute('src') ?? ''

        return {
          id: i,
          title: title,
          url: url,
          site: 'bazos',
          description: description,
          is_active: true,
          main_image: mainImage,
        }
      }
    )
   // .filter((item: Item|null): Item => item !== null)
}

async function connect(): Promise<Client> {
  return await new Client().connect({
    hostname: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "toor",
    // db: "bfpt",
  })
}

async function prepareDatabase(db: Client): Promise<Client> {
  await db.execute(`CREATE DATABASE IF NOT EXISTS bfpt`)
  await db.execute(`USE bfpt`)

  return db
}

async function prepareItemsTable(db: Client): Promise<Client> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title varchar(256) NOT NULL,
      url varchar(1024) NOT NULL,
      site varchar(64) NOT NULL,
      description text NOT NULL,
      is_active tinyint(1) NOT NULL,
      main_image varchar(1024) NOT NULL
    )
  `)

  return db
}

export const handler: Handlers<Array<Item>> = {
  async GET(_, ctx) {
    const data = await fetchBazos()

    const client = await connect()

    await prepareDatabase(client)
    await prepareItemsTable(client)

    // const { rows: users } = await client.execute(`select * from users`);
    // console.log(users);

    return ctx.render(data)
  }
}

export default function Home( {data}: PageProps<Array<Item>> ) {
  return (
    <>
      <Head>
        <title>Bug Free Palm Tree Subaru app</title>
      </Head>
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
        <div>
          {data.map(item => (
              <Fragment key={item.id}>
                <div>
                  <h2>{item.title}</h2>
                  <img src={item.main_image} alt="" />
                  <p>{item.description}</p>
                </div>
              </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
