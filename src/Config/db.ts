import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.SUPABASE_DB) {
  throw new Error("SUPABASE_DB is not defined in .env")
}

const dbUrl = process.env.SUPABASE_DB
const urlParts = new URL(dbUrl)
const host = urlParts.hostname

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    host: host,
    ssl: { require: true, rejectUnauthorized: false },
    ipv6: false,
  },
})

// Only export the sequelize instance - DO NOT import models here!
export default sequelize
