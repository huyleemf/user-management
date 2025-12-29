import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    pool: { min: 0, max: 5 }, // number of connection in pool
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "js",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DB_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "js",
    },
  },
};

// create a db
// CREATE DATABASE personnel;

// drop all tables to test migrations
// DROP SCHEMA public CASCADE;
// CREATE SCHEMA public;

// manage db schema changes
// up func -> apply changes
// down func -> revert changes

// npx knex --knexfile ./src/config/knexfile.js migrate:make users
// npx knex migrate:make users
// npx knex --knexfile ./src/config/knexfile.js migrate:latest
// add --esm if not working

// populate database with test data
// npx knex --knexfile ./src/config/knexfile.js seed:make usersSeeder
// npx knex --knexfile ./src/config/knexfile.js seed:run
