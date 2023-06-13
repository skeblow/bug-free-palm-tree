import { DOMParser } from "DOMParser"
import { Item } from "../components/model/Item.ts"

export async function fetchAllSauto (): Promise<Array<Item>> {
  const url = 'https://www.sauto.cz/inzerce/osobni/subaru?cena-do=500000&vykon-od=125kw&palivo=benzin&pohon=4x4'

  const response = await fetch(url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  if (doc === null) {
    return []
  }

  return (Array.from(doc.querySelectorAll('.c-item')) as unknown as Array<HTMLElement>)
    .map(
      (el: HTMLElement): Item => {
        const title = el.querySelector('.c-item__name')?.textContent ?? ''
        const url = el.querySelector('a')?.getAttribute('href') ?? ''
        const mainImage = el.querySelector('img')?.getAttribute('src') ?? ''

        const data = el.querySelector('.c-item__info')?.textContent?.split(',') ?? []

        const year = parseInt(data[0] ?? '0')
        const mileage = parseInt(data[1]?.trim()?.replace(/\s+/, '') ?? '0')
        const isAutomat = data[3]?.includes('Automatická') ?? false
        const price = parseInt(el.querySelector('.c-item__price')?.textContent?.replace(/\s+/, '') ?? '0')

        return {
          id: null,
          title: title,
          url: url,
          site: 'sauto',
          description: '',
          price: price,
          is_active: true,
          is_parsed: false,
          is_checked: false,
          main_image: mainImage,
          year: year,
          mileage: mileage,
          model: null,
          generation: null,
          engine: null,
          power: null,
          is_automat: isAutomat,
        }
      }
    )
}
