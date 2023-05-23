export interface Item {
  id: number|null
  title: string
  url: string
  site: string
  description: string
  price: number|null
  is_active: boolean
  is_parsed: boolean	
  is_checked:	boolean	
  main_image:	string	
  year: number|null
  mileage: number|null	
  model: string|null	
  generation: string|null	
  engine: string|null
  power: number|null
  is_automat: boolean|null
}
