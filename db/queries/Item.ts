import { Item } from "../../components/model/Item.ts"
import { Database } from "../Database.ts"

export async function selectAllItems (db: Database): Promise<Array<Item>> {
  return await db.getClient().query('SELECT * FROM items')
}

export async function updateAllItemsIsActive(db: Database, isActive: boolean): Promise<void> {
  await db.getClient().query('UPDATE items SET is_active = ?', [isActive ? 1 : 0])
}

export async function insertItem(db: Database, item: Item): Promise<Item> {
  const result = await db.getClient().query('INSERT INTO items (title, url, site, description, is_active, main_image) VALUES (?, ?, ?, ?, ?, ?)', [
    item.title,
    item.url,
    item.site,
    item.description,
    item.is_active,
    item.main_image,
  ])

  return {
    ...item,
    id: result.lastInsertId,
  }
}
