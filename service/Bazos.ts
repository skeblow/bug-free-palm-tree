import { Item } from "../components/model/Item.ts"
import { DOMParser } from "DOMParser"

export async function fetchBazos(): Promise<Array<Item>>{
  const url = 'https://auto.bazos.cz/?hledat=subaru+forester+xt&rubriky=auto&hlokalita=&humkreis=25&cenaod=50000&cenado=300000&Submit=Hledat&kitx=ano'

  const response = await fetch(url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  if (doc === null) {
    return []
  }

  return (Array.from(doc.querySelectorAll('.maincontent .inzeraty')) as unknown as Array<HTMLElement>)
    .map(
      (el: HTMLElement, i: number): Item => {
        const title = el.querySelector('.nadpis')?.textContent ?? ''
        const url = el.querySelector('.nadpis a')?.getAttribute('href') ?? ''
        const description = el.querySelector('.popis')?.textContent ?? ''
        const mainImage = el.querySelector('.obrazek')?.getAttribute('src') ?? ''

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
}
