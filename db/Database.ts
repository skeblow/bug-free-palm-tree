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
    await this.prepareItemsTable()
    await this.prepareSettingsTable()
  }

  async init (): Promise<Database> {
    await this.connect()

    return this
  }

  async connect (): Promise<object> {
    this.client = await new Client().connect({
      hostname: Deno.env.get("DB_HOST"),
      username: "bfpt",
      db: "bfpt",
      port: 3306,
      password: Deno.env.get("DB_PASSWORD"),
    })

    return this.client
  }

  async prepareItemsTable(): Promise<Client> {
    await this.getClient().query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT NOT NULL AUTO_INCREMENT,
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
        is_automat boolean NULL,
        PRIMARY KEY (id)
      )
    `)
  
    return this.getClient()
  }

  async prepareSettingsTable(): Promise<Client> {
    await this.getClient().query(`
      CREATE TABLE IF NOT EXISTS settings (
        id varchar(64) NOT NULL,
        value varchar(256) NOT NULL,
        PRIMARY KEY (id)
      )
    `)

    return this.getClient()
  }
}
