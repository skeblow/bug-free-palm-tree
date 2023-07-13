import { Item } from "../components/model/Item.ts"
import { DOMParser } from "DOMParser"
import { Database } from "../db/Database.ts"
import { updateItem } from "../db/queries/Item.ts"

export async function fetchAllBazos (): Promise<Array<Item>> {
  const urls = [
    'https://auto.bazos.cz/?hledat=subaru&hlokalita=&humkreis=25&cenaod=50000&cenado=500000&order=3',
  ]

  for (let i = 1; i <= 20; i++) {
    const page = i * 20
    urls.push(`https://auto.bazos.cz/${page}/?hledat=subaru&hlokalita=&humkreis=25&cenaod=50000&cenado=500000&order=3`)
  }

  let elements: Array<HTMLElement> = []

  for (const url of urls) {
    const response = await fetch(url)
    const text = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')

    if (doc === null) {
      continue
    }

    const docElements = Array.from(doc.querySelectorAll('.maincontent .inzeraty')) as unknown as Array<HTMLElement>

    elements = elements.concat(docElements)
  }

  return elements.map((el: HTMLElement): Item => {
    const title = el.querySelector('.nadpis')?.textContent ?? ''
    const url = 'https://auto.bazos.cz' + el.querySelector('.nadpis a')?.getAttribute('href') ?? ''
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
  })
  .filter((item: Item): boolean => item.title.toLocaleLowerCase().includes('subaru'))
  .filter((item: Item): boolean => ! item.title.toLocaleLowerCase().includes('koupím'))
}

export async function fetchOneBazos(url: string): Promise<Item> {
  const response = await fetch(url)
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
      price = parseInt(rawPrice.replace(/\s+/, ''))
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
    year: parseYear(item.title) ?? parseYear(item.description) ?? item.year,
    mileage: parseMileage(item.title) ?? parseMileage(item.description) ?? item.mileage,
    power: parsePower(item.title) ?? parsePower(item.description) ?? item.power,
    is_automat: parseIsAutomat(text) ?? item.is_automat,
    model: parseModel(item.title) ?? parseModel(item.description) ?? item.model,
    engine: parseEngine(item.title) ?? parseEngine(item.description) ?? item.engine,
  }

  updateItem(db, item)

  return item
}

function parseEngine (text: string): string|null {
  text = text.replace(' 4x4', '')

  let matches = text.match(/(forester|motor|outback|benzin|legacy|subaru|tribeca|impreza|wrx|levorg|ombi|justy)e?m? \w?\w? ?([1,2,3][\.\,][0,5,6])/i)

  if (matches && matches[2]) {
    return matches[2].replace(',', '.')
  }

  const oneAndSixLiter = [
    /1.6 (gts|t)/i,
    /1.6i/i
  ]

  const twoLiter = [
    /2.0 ?x?T/i,
    /(dvoulitr|2,0) benzín/i,
    /1 995 cm3/i,
    /2.0 (Boxer|l)/i,
    /2.od/i,
    /FB20/i,
    /DIESEL 2.0D/i
  ]

  const twoAndHalfLiter = [
    /2.5 ?T/i,
    /motor ej25/i,
    /2.5 ?i/i,
    /2457cm3/i,
    /2500ccm/i,
    /2.5litru/i
  ]

  const threeLiter = [
    /3.0h6/i
  ]

  const threeAndSixLiter = [
    /3 630 ccm/i
  ]

  for (const pattern of oneAndSixLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '1.6'
    }
  }

  for (const pattern of twoLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '2.0'
    }
  }

  for (const pattern of twoAndHalfLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '2.5'
    }
  }

  for (const pattern of threeLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '3.0'
    }
  }

  for (const pattern of threeAndSixLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '3.6'
    }
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

  matches = text.match(/levorg/i)

  if (matches) {
    return 'levorg'
  }

  matches = text.match(/wrx sti/i)

  if (matches) {
    return 'impreza'
  }

  matches = text.match(/legacy/i)

  if (matches) {
    return 'legacy'
  }

  matches = text.match(/impreza/i)

  if (matches) {
    return 'impreza'
  }

  matches = text.match(/justy/i)

  if (matches) {
    return 'justy'
  }

  matches = text.match(/tribeca/i)

  if (matches) {
    return 'tribeca'
  }

  matches = text.match(/xv/i)

  if (matches) {
    return 'crosstrek'
  }

  matches = text.match(/crosstrek/i)

  if (matches) {
    return 'crosstrek'
  }


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
    return parseInt(matches[1].replace(/\s+/, ''))
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
