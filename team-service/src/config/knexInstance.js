import pkg from "knex";
import config from "./knexfile.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const { knex } = pkg;

const knexInstance = knex(config[process.env.NODE_ENV]);

export default knexInstance;
