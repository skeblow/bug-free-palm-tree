import { Item } from "../../components/model/Item.ts"
import { Database } from "../Database.ts"

export async function selectAllItems (db: Database): Promise<Array<Item>> {
  return await db.getClient().query('SELECT * FROM items')
}

export async function selectItemByUrl(db: Database, url: string): Promise<Item|null> {
  const items = await db.getClient().query('SELECT * FROM items WHERE url = ? LIMIT 1', [url])

  return items.length === 1 ? items[0] : null
}

export async function selectItemById(db: Database, id: number): Promise<Item|null> {
  const items = await db.getClient().query('SELECT * FROM items WHERE id = ? LIMIT 1', [id])

  return items.length === 1 ? items[0] : null
}

export async function updateAllItemsIsActive(db: Database, isActive: boolean): Promise<void> {
  await db.getClient().query('UPDATE items SET is_active = ?', [isActive ? 1 : 0])
}

export async function deleteInactiveItems(db: Database): Promise<void> {
  await db.getClient().query('DELETE FROM items WHERE is_active = 0');
}

export async function insertItem(db: Database, item: Item): Promise<Item> {
  const result = await db.getClient().query('INSERT INTO items (title, url, site, description, is_active, main_image) VALUES (?, ?, ?, ?, ?, ?)', [
    item.title,
    item.url,
    item.site,
    item.description,
    item.is_active ? 1 : 0,
    item.main_image,
  ])

  return {
    ...item,
    id: result.lastInsertId,
  }
}

export async function updateItem(db: Database, item: Item): Promise<void> {
  await db.getClient().query('UPDATE items SET title = ?, url = ?, site = ?, description = ?, is_active = ?, main_image = ? WHERE id = ?', [
    item.title,
    item.url,
    item.site,
    item.description,
    item.is_active ? 1 : 0,
    item.main_image,
    item.id,
  ])
}
