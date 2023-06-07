import { Item } from "../components/model/Item.ts"
import { DOMParser } from "DOMParser"
import { Database } from "../db/Database.ts"
import { updateItem } from "../db/queries/Item.ts"

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
          price: null,
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
  const rawPrice = doc.querySelector('.listadvlevo tr:last-child td:last-child')?.innerText?.trim() ?? null
  let price = null

  if (rawPrice !== null) {
    if (rawPrice.match(/Kč/i)) {
      price = parseInt(rawPrice.replace(' ', ''))
    }
  }

  return {
    id: null,
    title: '',
    url: url,
    site: 'bazos',
    description: description,
    price: price,
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

export function parseBazosItem (db: Database, item: Item): Item {
  const text = item.description + item.title

  item = {
    ...item,
    year: parseYear(text) ?? item.year,
    mileage: parseMileage(text) ?? item.mileage,
    power: parsePower(text) ?? item.power,
    is_automat: parseIsAutomat(text) ?? item.is_automat,
    model: parseModel(text) ?? item.model,
    engine: parseEngine(text) ?? item.engine,
  }

  updateItem(db, item)

  return item
}

function parseEngine (text: string): string|null {
  let matches = text.match(/forester \w?\w? ?(2.[0,5])/i)

  if (matches && matches[1]) {
    return matches[1].replace(',', '.')
  }

  matches = text.match(/motor (2.[0,5])/i)

  if (matches && matches[1]) {
    return matches[1].replace(',', '.')
  }

  matches = text.match(/benzin (2.[0,5])/i)

  if (matches && matches[1]) {
    return matches[1].replace(',', '.')
  }

  return null
}

function parseModel (text: string): string|null {
  let matches = text.match(/outback/i)

  if (matches) {
    return 'outback'
  }

  matches = text.match(/forester/i)

  if (matches) {
    return 'forester'
  }


  matches = text.match(/legacy/i)

  if (matches) {
    return 'legacy'
  }

  matches = text.match(/impreza/i)

  if (matches) {
    return 'impreza'
  }
1
  return null
}

function parseYear (text: string): number|null {
  const matches = text.match(/r.v. ?(\d{4})/i)

  if (matches && matches[1]) {
    return parseInt(matches[1])
  }

  return null
}

function parseMileage (text: string): number|null {
  let matches = text.match(/(\d+) ?(tkm|tisíc km|tis km)/i)

  if (matches && matches[1]) {
    return parseInt(matches[1]) * 1000
  }

  matches = text.match(/najeto ([\d ]{6,})/i)

  if (matches && matches[1]) {
    return parseInt(matches[1].replace(' ', ''))
  }

  matches = text.match(/najeto \w+? ?(\d+)/i)

  if (matches && matches[1]) {
    return parseInt(matches[1])
  }

  return null
}

function parsePower (text: string): number|null {
  const matches = text.match(/(\d+) ?kw/i)

  if (matches && matches[1]) {
    return parseInt(matches[1])
  }

  return null
}

function parseIsAutomat (text: string): boolean|null {
  let matches = text.match(/manuál/i)

  if (matches) {
    return false
  }

  matches = text.match(/Automatická převodovka/i)

  if (matches) {
    return true
  }

  return null
}
