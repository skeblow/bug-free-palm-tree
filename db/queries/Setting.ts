import { Database } from "../Database.ts"

export async function selectSetting (db: Database, key: string): Promise<string|null> {
   const result = await db.getClient().queryObject('SELECT * FROM settings WHERE key = $KEY LIMIT 1', { key })

   return result.rows.length === 1 ? result.rows[0].value as string : null
}

export async function updateSetting (db: Database, key: string, value: string|null): Promise<void> {
    await db.getClient().queryObject('DELETE FROM settings WHERE key = $KEY', { key })
    await db.getClient().queryObject('INSERT INTO settings (key, value) VALUES ($KEY, $VALUE)', { key, value })
}
