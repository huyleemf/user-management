import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import teamRoutes from "./src/routes/teamRoutes.js";
import errorHandler from "./src/middleware/errorMiddleware.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = process.env.PORT || 5000;
const host = process.env.HOST || "localhost";

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(cookieParser());

app.use("/teams", teamRoutes);

app.listen(port, host, () => {
  console.log(
    `${chalk.cyan("🌐 Team Service")} running in ${chalk.yellow(
      process.env.NODE_ENV
    )} environment and ready at http://${chalk.green(host)}:${chalk.green(
      port
    )}`
  );
});

app.use(errorHandler);
