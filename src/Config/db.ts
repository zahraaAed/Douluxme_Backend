import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_DB) {
  throw new Error('SUPABASE_DB is not defined in .env');
}

const dbUrl = process.env.SUPABASE_DB!;
const urlParts = new URL(dbUrl); // Parse the URL
const host = urlParts.hostname; // Extract the hostname

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Set to true for SQL query logging in dev
  dialectOptions: {
    host: host, // Explicitly set the host
    ssl: { require: true, rejectUnauthorized: false }, // SSL required by Supabase
    // Force IPv4 by adding this:
    ipv6: false, // Disable IPv6
  },
});

export default sequelize;
