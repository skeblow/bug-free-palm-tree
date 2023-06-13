import { Item } from "../../components/model/Item.ts"
import { Database } from "../Database.ts"
import { ItemFilter } from "../../components/model/ItemFilter.ts"

export async function selectAllItems (db: Database, filter: ItemFilter): Promise<Array<Item>> {
  const conditions = []
  
  if (filter.models.length > 0) {
    const models = filter.models.map(model => `'${model}'`).join(', ')

    conditions.push(`model IN (${models})`)
  }

  if (filter.engines.length > 0) {
    const engines = filter.engines.map(engine => `'${engine}'`).join(', ')

    conditions.push(`engine IN (${engines})`)
  }

  let where = '';

  if (conditions.length > 0) {
    where = `WHERE ${conditions.join(' AND ')}`
  }

  return await db.getClient().query(`SELECT * FROM items ${where}`)
}

export async function selectItemByUrl (db: Database, url: string): Promise<Item|null> {
  const items = await db.getClient().query('SELECT * FROM items WHERE url = ? LIMIT 1', [url])

  return items.length === 1 ? items[0] : null
}

export async function selectItemById (db: Database, id: number): Promise<Item|null> {
  const items = await db.getClient().query('SELECT * FROM items WHERE id = ? LIMIT 1', [id])

  return items.length === 1 ? items[0] : null
}

export async function selectItemFilter (db: Database): Promise<ItemFilter> {
  const filter = await db.getClient().query(`
    SELECT 
      GROUP_CONCAT(DISTINCT model) AS models,
      GROUP_CONCAT(DISTINCT engine) AS engines,
      MIN(year) AS year_from,
      MAX(year) AS year_to
    FROM items
  `)
  
  if (filter.length !== 1) {
    return {
      models: [],
      engines: [],
      year_from: 0,
      year_to: 0,
    }
  }

  return {
    models: filter[0].models.split(','),
    engines: filter[0].engines.split(','),
    year_from: filter[0].year_from,
    year_to: filter[0].year_to,
  }
}

export async function updateAllItemsIsActive (db: Database, isActive: boolean): Promise<void> {
  await db.getClient().query('UPDATE items SET is_active = ?', [isActive ? 1 : 0])
}

export async function deleteInactiveItems (db: Database): Promise<void> {
  await db.getClient().query('DELETE FROM items WHERE is_active = 0');
}

export async function insertItem (db: Database, item: Item): Promise<Item> {
  console.log(item)
  const result = await db.getClient().query(
    `INSERT INTO items SET 
      title = ?,
      url = ?,
      site = ?,
      description = ?,
      price = ?,
      is_active = ?,
      is_parsed = ?,
      is_checked = ?,
      main_image = ?,
      year = ?,
      mileage = ?,
      model = ?,
      generation = ?,
      engine = ?,
      power = ?,
      is_automat = ?
    `, [
      item.title,
      item.url,
      item.site,
      item.description,
      item.price,
      item.is_active ? 1 : 0,
      item.is_parsed ? 1 : 0,
      item.is_checked ? 1 : 0,
      item.main_image,
      item.year,
      item.mileage,
      item.model,
      item.generation,
      item.engine,
      item.power,
      item.is_automat ? 1 : 0,
    ]
  )

  return {
    ...item,
    id: result.lastInsertId,
  }
}

export async function updateItem (db: Database, item: Item): Promise<void> {
  const isParsed = item.price !== null
    && item.year !== null
    && item.model !== null
    && item.engine !== null

  await db.getClient().query(
    `UPDATE items SET
      title = ?,
      url = ?,
      site = ?,
      description = ?,
      price = ?,
      is_active = ?,
      is_parsed = ?,
      is_checked = ?,
      main_image = ?,
      year = ?,
      mileage = ?,
      model = ?,
      generation = ?,
      engine = ?,
      power = ?,
      is_automat = ?
    WHERE id = ?
    `, [
      item.title,
      item.url,
      item.site,
      item.description,
      item.price,
      item.is_active ? 1 : 0,
      isParsed ? 1 : 0,
      item.is_checked ? 1 : 0,
      item.main_image,
      item.year,
      item.mileage,
      item.model,
      item.generation,
      item.engine,
      item.power,
      item.is_automat ? 1 : 0,
      item.id,
    ]
  )
}
