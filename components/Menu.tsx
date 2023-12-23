import { JSX } from "preact"
import { IS_BROWSER } from "$fresh/runtime.ts"

export function Menu(props: JSX.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul class="flex p-3 bg-gray-100">
      <li>
        <img
            src="/logo.svg"
            class="w-8 h-8"
            alt="the fresh logo: a sliced lemon dripping with juice"
          />
      </li>
      <li class="px-2"><a href="/">Home</a></li>
    </ul>
  )
}
