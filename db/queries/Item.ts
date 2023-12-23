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

  if (filter.year_from > 0) {
    conditions.push(`(year >= ${filter.year_from} OR year IS NULL)`)
  }

  if (filter.year_to > 0) {
    conditions.push(`(year <= ${filter.year_to} OR year IS NULL)`)
  2}

  let where = '';

  if (conditions.length > 0) {
    where = `WHERE ${conditions.join(' AND ')}`
  }

  const result = await db.getClient().queryObject(`SELECT * FROM items ${where}`)

  return result.rows as Array<Item>
}

export async function selectItemByUrl (db: Database, url: string): Promise<Item|null> {
  const result = await db.getClient().queryObject('SELECT * FROM items WHERE url = $URL LIMIT 1', { url })

  return result.rows.length === 1 ? result.rows[0] as Item : null
}

export async function selectItemById (db: Database, id: number): Promise<Item|null> {
  const result = await db.getClient().queryObject('SELECT * FROM items WHERE id = $ID LIMIT 1', { id })

  return result.rows.length === 1 ? result.rows[0] as Item : null
}

export async function selectItemFilter (db: Database): Promise<ItemFilter> {
  const result = await db.getClient().queryObject<{models: string, engines: string, year_from: number, year_to: number}>(`
    SELECT 
      STRING_AGG(DISTINCT model, ',') AS models,
      STRING_AGG(DISTINCT engine, ',') AS engines,
      MIN(year) AS year_from,
      MAX(year) AS year_to
    FROM items
  `)

  const filter = result.rows

  if (filter.length !== 1) {
    return {
      models: [],
      engines: [],
      year_from: 0,
      year_to: 0,
    }
  }

  return {
    models: filter[0].models?.split(',') ?? [],
    engines: filter[0].engines?.split(',') ?? [],
    year_from: filter[0].year_from,
    year_to: filter[0].year_to,
  }
}

export async function updateAllItemsIsActive (db: Database, isActive: boolean): Promise<void> {
  await db.getClient().queryObject(`UPDATE items SET is_active = ${isActive}`)
}

export async function deleteInactiveItems (db: Database): Promise<void> {
  await db.getClient().queryObject('DELETE FROM items WHERE is_active = false');
}

export async function insertItem (db: Database, item: Item): Promise<Item> {
  const result = await db.getClient().queryObject<{id: number}>(
    `INSERT INTO items (
      title,
      url,
      site,
      description,
      price,
      is_active,
      is_parsed,
      is_checked,
      main_image,
      year,
      mileage,
      model,
      generation,
      engine,
      power,
      is_automat
    ) VALUES (
      $TITLE,
      $URL,
      $SITE,
      $DESCRIPTION,
      $PRICE,
      $IS_ACTIVE,
      $IS_PARSED,
      $IS_CHECKED,
      $MAIN_IMAGE,
      $YEAR,
      $MILEAGE,
      $MODEL,
      $GENERATION,
      $ENGINE,
      $POWER,
      $IS_AUTOMAT
    ) RETURNING id`, {
      ...item
    }
  )

  return {
    ...item,
    id: result.rows[0].id,
  }
}

export async function updateItem (db: Database, item: Item): Promise<void> {
  item.is_parsed = item.price !== null
    && item.year !== null
    && item.model !== null
    && item.engine !== null

  await db.getClient().queryArray(
    `UPDATE items SET
      title = $TITLE,
      url = $URL,
      site = $SITE,
      description = $DESCRIPTION,
      price = $PRICE,
      is_active = $IS_ACTIVE,
      is_parsed = $IS_PARSED,
      is_checked = $IS_CHECKED,
      main_image = $MAIN_IMAGE,
      year = $YEAR,
      mileage = $MILEAGE,
      model = $MODEL,
      generation = $GENERATION,
      engine = $ENGINE,
      power = $POWER,
      is_automat = $IS_AUTOMAT
    WHERE id = $ID
    `, {
      ...item,
    }
  )
}
