// import { serve } from "https://deno.land/std@0.99.0/http/server.ts";

// const port = parseInt(`${Deno.env.get("PORT")}`) || 8000;
// const appName = Deno.env.get("APP_NAME") || "Unknown";

// const s = serve({ port });

// for await (const req of s) {
//   const headers = new Headers();
//   headers.set("Content-Type", "text/html");
//   req.respond({
//     body: `
//   <html>
//     <h1>Hello from ${appName}</h1>
//     <ul>
//       <li><a href="/">Home</a>
//       <li><a href="/shop">Shop</a>
//       <li><a href="/showcase">Showcase</a>
//     </ul>
//   </html>
//   `,
//     headers,
//   });
// }

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
