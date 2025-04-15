"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.SUPABASE_DB) {
    throw new Error('SUPABASE_DB is not defined in .env');
}
const dbUrl = process.env.SUPABASE_DB;
const urlParts = new URL(dbUrl); // Parse the URL
const host = urlParts.hostname; // Extract the hostname
const sequelize = new sequelize_1.Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false, // Set to true for SQL query logging in dev
    dialectOptions: {
        host: host, // Explicitly set the host
        ssl: { require: true, rejectUnauthorized: false }, // SSL required by Supabase
        // Force IPv4 by adding this:
        ipv6: false, // Disable IPv6
    },
});
exports.default = sequelize;
