import { Item } from "../components/model/Item.ts"
import { DOMParser } from "DOMParser"

export async function fetchAllSportovnivozy (): Promise<Array<Item>> {
  const url = 'https://www.sportovnivozy.cz/model-33-164-subaru-ostatni-modely'

  const response = await fetch(url)
  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  if (doc === null) {
    return []
  }

  return (Array.from(doc.querySelectorAll('#content .vypisDilo')) as unknown as Array<HTMLElement>)
  .map(
    (el: HTMLElement): Item => {
      const title = (el.querySelector('a')?.getAttribute('title') ?? '').trim()
      const url = 'https://www.sportovnivozy.cz/' + el.querySelector('a')?.getAttribute('href') ?? ''
      const mainImage = 'https://www.sportovnivozy.cz/' + el.querySelector('img')?.getAttribute('src') ?? ''

      const data: Array<string> = el.querySelectorAll('tr')[1].textContent?.trim().split("\n") ?? []

      let year:number|null = null
      let mileage:number|null = null
      let engine:string|null = null
      let power:number|null = null

      if (data.length === 2) {
        const yearMileage = data[0].split('/')

        year = parseInt(yearMileage[0].trim() ?? 0)
        mileage = parseInt(yearMileage[1].trim().replace(/\s+/, ''))

        const enginePower = data[1].split('/')
        
        if (enginePower.length === 2) {
          engine = (parseInt(enginePower[0].trim().replace(/\s+/, '')) / 1000).toFixed(1)
  
          power = parseInt(enginePower[1].trim())
        } else if (enginePower.length === 1) {
          power = parseInt(enginePower[0].trim())
        }
      }

      let price:number = parseInt(el.querySelectorAll('tr')[2].textContent?.replaceAll(/\s+/g, '').replace('NÁŠTIP', '') ?? '0')
      
      if (Number.isNaN(price)) {
        // cena dohodou
        price = 0
      }

      return {
        id: null,
        title: title,
        url: url,
        site: 'sportovnivozy',
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
        is_automat: null,
      }
    }
  )
}
