import "reflect-metadata"

import { DataSource } from "typeorm";

import path from "path";

const AppDataSource = new DataSource({
  type: 'postgres',
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  url: process.env.DATABASE_URL,
  schema: 'next_chats',
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "../src/Entity/**/**.ts")],
})

export default AppDataSource

