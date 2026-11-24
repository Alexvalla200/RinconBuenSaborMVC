import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'rincon_buen_sabor',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '123456'
    })

export const getDbPool = () => pool