import { Item } from "../components/model/Item.ts"
import { DOMParser } from "DOMParser"

export async function fetchAllBazar (): Promise<Array<Item>> {
  const url = 'https://www.bazar.cz/subaru/?ro=1999&rd=2023&p2=500000&SP=14-71_38-100-999999999_'
  // https://www.bazar.cz/subaru/2/?ro=1999&rd=2023&p2=500000&SP=14-71_38-100-999999999_

  const response = await fetch(url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  if (doc === null) {
    return []
  }

  return (Array.from(doc.querySelectorAll('.sale-item')) as unknown as Array<HTMLElement>)
    .map(
      (el: HTMLElement): Item => {
        const title = el.querySelector('a')?.getAttribute('title') ?? ''
        const url = el.querySelector('a')?.getAttribute('href') ?? ''
        const mainImage = el.querySelector('img')?.getAttribute('src') ?? ''

        const mileage = parseInt((el.querySelector('.najeto')?.textContent?.replace('Najeto', '')?.replace(' ', '') ?? '0'))
        const year = parseInt((el.querySelector('.vyroba')?.textContent?.replace('Rok výroby', '') ?? '0'))
        const isAutomat = el.querySelector('.razeni')?.textContent?.includes('automatická') ?? false
        const engine = String(parseFloat(el.querySelector('.objem')?.textContent?.replace('Objem', '') ?? '0').toFixed(1))
        const power = parseInt(el.querySelector('.vykon')?.textContent?.replace('Výkon', '') ?? '0')
        const price = parseInt(el.querySelector('.price')?.textContent?.replace(' ', '') ?? '0')

        return {
          id: null,
          title: title,
          url: url,
          site: 'bazar',
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
          engine: engine,
          power: power,
          is_automat: isAutomat,
        }
      }
    )
}
