import { Item } from "../components/model/Item.ts"
import { DOMParser } from "DOMParser"

export async function fetchAllBazos (): Promise<Array<Item>> {
  const urls = [
    'https://auto.bazos.cz/?hledat=subaru&hlokalita=&humkreis=25&cenaod=20000&cenado=500000&order=4',
  ]

  for (let i = 1; i <= 30; i++) {
    const page = i * 20
    urls.push(`https://auto.bazos.cz/${page}/?hledat=subaru&hlokalita=&humkreis=25&cenaod=20000&cenado=500000&order=4`)
  }

  let elements: Array<HTMLElement> = []

  for (const url of urls) {
    const response = await fetch(url, {
      headers: {
        "Cookie": "gal=g"
      }
    })
    const text = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')

    if (doc === null) {
      continue
    }

    const docElements = Array.from(doc.querySelectorAll('.gallery .galleryobal')) as unknown as Array<HTMLElement>
    elements = elements.concat(docElements)
    console.log('fetch all bazos', docElements.length)

    if (docElements.length === 0) {
      break
    }
  }

  return elements.map((el: HTMLElement): Item => {
    const title = el.querySelector('.gallerytxt')?.textContent ?? ''
    const url = 'https://auto.bazos.cz' + el.querySelector('.galleryobrvnejsi a')?.getAttribute('href') ?? ''
    const mainImage = el.querySelector('.galleryobrazek')?.getAttribute('src') ?? ''

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
  .filter((item: Item): boolean => ! item.title.toLocaleLowerCase().includes('koupím') && ! item.title.toLocaleLowerCase().includes('koupim'))
}

export async function fetchOneBazos(url: string): Promise<Item> {
  console.log('fetching bazos ', url)

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
