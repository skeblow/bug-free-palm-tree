import { Client } from "client"

export class Database {
  private client: Client|null = null

  public getClient(): Client {
    if (this.client === null) {
      throw new Error('Client is not initialized!')
    }

    return this.client
  }

  async migrate (): Promise<void> {
    await this.prepareDatabase()
    await this.prepareItemsTable()
  }

  async init (): Promise<Database> {
    await this.connect()

    return this
  }

  async connect (): Promise<Client> {
    // this.client = new Client({
    //   hostname: "127.0.0.1",
    //   port: 5432,
    //   user: "postgres",
    //   password: "postgres",
    //   database: "bfpt",
    // })
    this.client = new Client('postgresql://postgres:PkoRrCON75iy3l2E@db.lbuugqgkghynuzhzgvmr.supabase.co:5432/postgres')
    // 
    await this.client.connect()

    return this.client
  }

  async prepareDatabase (): Promise<Client> {
    // await this.getClient().queryArray(`CREATE DATABASE IF NOT EXISTS bfpt`)
    // await this.getClient().execute(`USE bfpt`)
  
    return this.getClient()
  }

  async prepareItemsTable(): Promise<Client> {
    await this.getClient().queryArray(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        title varchar(256) NOT NULL,
        url varchar(1024) NOT NULL,
        site varchar(64) NOT NULL,
        description text NOT NULL,
        price int NULL,
        is_active boolean NOT NULL,
        main_image varchar(1024) NOT NULL,
        is_parsed boolean NOT NULL,
        is_checked boolean NOT NULL,
        year int NULL,
        mileage int NULL,
        model varchar(64) NULL,
        generation varchar(64) NULL,
        engine varchar(64) NULL,
        power int NULL,
        is_automat boolean NULL
      )
    `)
  
    return this.getClient()
  }
}
