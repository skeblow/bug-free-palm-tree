import { Client } from "client"

export class Database {
  private client: Client|null = null

  public getClient(): Client {
    if (this.client === null) {
      throw new Error('Client is not initialized!')
    }

    return this.client
  }

  async init (): Promise<Database> {
    await this.connect()
    await this.prepareDatabase()
    await this.prepareItemsTable()

    return this
  }

  async connect (): Promise<Client> {
    this.client = await new Client().connect({
      hostname: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "toor",
      // db: "bfpt",
    })

    return this.client
  }

  async prepareDatabase (): Promise<Client> {
    await this.getClient().execute(`CREATE DATABASE IF NOT EXISTS bfpt`)
    await this.getClient().execute(`USE bfpt`)
  
    return this.getClient()
  }

  async prepareItemsTable(): Promise<Client> {
    await this.getClient().execute(`
      CREATE TABLE IF NOT EXISTS items (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title varchar(256) NOT NULL,
        url varchar(1024) NOT NULL,
        site varchar(64) NOT NULL,
        description text NOT NULL,
        is_active tinyint(1) NOT NULL,
        main_image varchar(1024) NOT NULL
      )
    `)
  
    return this.getClient()
  }
}
