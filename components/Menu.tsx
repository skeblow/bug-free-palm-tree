import { JSX } from "preact"
import { IS_BROWSER } from "$fresh/runtime.ts"

export function Menu(props: JSX.HTMLAttributes<HTMLUListElement>) {
    return (
        <ul class="flex p-3 bg-gray-100">
            <li class="px-2"><a href="/">Home</a></li>
            <li class="px-2"><a href="/refresh">Refresh</a></li>
        </ul>
    )
}