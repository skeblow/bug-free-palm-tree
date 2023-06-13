import { Item } from "../components/model/Item.ts";
import { DOMParser } from "DOMParser"

export async function fetchAllAwd (): Promise<Array<Item>> {
  const url = 'http://awd.cz/autobazar/autobazar'

  const response = await fetch(url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  if (doc === null) {
    return []
  }

  return (Array.from(doc.querySelectorAll('.bazarbox')) as unknown as Array<HTMLElement>)
    .map(
      (el: HTMLElement): Item => {
        const title = (el.querySelector('.heading')?.textContent ?? '').trim()
        const url = 'http://awd.cz' + el.querySelector('a')?.getAttribute('href') ?? ''
        const mainImage = 'http://awd.cz' + el.querySelector('img')?.getAttribute('src') ?? ''
        const price = parseInt(
          (el.querySelector('.description > strong')?.textContent ?? '0').replace(' ', '')
        )
        const mileage = parseInt(
          (el.querySelector('.description > em')?.textContent ?? '0').replace(' ', '')
        )
        const year = parseInt(el.querySelector('.description > small')?.textContent ?? '0')

        return {
          id: null,
          title: title,
          url: url,
          site: 'awd',
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
          is_automat: null,
        }
      }
    )
}
