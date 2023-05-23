import { Item } from "../components/model/Item.ts"
import { DOMParser } from "DOMParser"

export async function fetchAllBazos(): Promise<Array<Item>>{
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
      (el: HTMLElement): Item => {
        const title = el.querySelector('.nadpis')?.textContent ?? ''
        const url = el.querySelector('.nadpis a')?.getAttribute('href') ?? ''
        const mainImage = el.querySelector('.obrazek')?.getAttribute('src') ?? ''

        return {
          id: null,
          title: title,
          url: url,
          site: 'bazos',
          description: '',
          is_active: true,
          is_parsed: false,
          is_checked: false,
          main_image: mainImage,
          year: null,
          mileage: null,
          model: null,
          generation: null,
          engine: null,
          power: null,
          is_automat: null,
        }
      }
    )
}

export async function fetchOneBazos(url: string): Promise<Item> {
  const response = await fetch('https://auto.bazos.cz' + url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  if (doc === null) {
    throw new Error('Unable to fetch one bazos ' + url + '!')
  }

  const description = doc.querySelector('.popisdetail')?.textContent ?? ''

  return {
    id: null,
    title: '',
    url: url,
    site: 'bazos',
    description: description,
    is_active: true,
    is_parsed: false,
    is_checked: false,
    main_image: '',
    year: null,
    mileage: null,
    model: null,
    generation: null,
    engine: null,
    power: null,
    is_automat: null,
  }
}

export function parseBazosItem(item: Item): Item {
  const matches = item.description.match(/(\d+)tkm/)

  let mileage

  if (matches && matches[1]) {
    mileage = parseInt(matches[1]) * 1000
  } else {
    mileage = item.mileage
  }

  return {
    ...item,
    mileage: mileage,
  }
}
