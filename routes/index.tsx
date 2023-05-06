import { useState } from "preact/hooks"
import { Head } from "$fresh/runtime.ts"
import Counter from "../islands/Counter.tsx"
import { Handlers, PageProps } from "$fresh/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"

async function fetchBazos(): Promise<string> {
  const url = 'https://auto.bazos.cz/?hledat=subaru+forester+xt&rubriky=auto&hlokalita=&humkreis=25&cenaod=50000&cenado=300000&Submit=Hledat&kitx=ano';

  const response = await fetch(url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  return doc?.querySelector('.maincontent')?.innerHTML ?? ''
}

export const handler: Handlers<string | null> = {
  async GET(_, ctx) {
    const data = await fetchBazos()

    return ctx.render(data)
  }
}

export default function Home( {data}: PageProps<string | null> ) {
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
          {data}
        </div>
      </div>
    </>
  )
}
