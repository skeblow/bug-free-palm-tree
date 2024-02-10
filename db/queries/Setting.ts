import { Database } from "../Database.ts"

export async function selectSetting (db: Database, id: string): Promise<string|null> {
   const result = await db.getClient().query('SELECT * FROM settings WHERE id = ? LIMIT 1', [ id ])

   return result.length === 1 ? result[0].value as string : null
}

export async function updateSetting (db: Database, id: string, value: string): Promise<void> {
    await db.getClient().query('DELETE FROM settings WHERE id = ?', [ id ])
    await db.getClient().query('INSERT INTO settings (id, value) VALUES (?, ?)', [ id, value ])
}
