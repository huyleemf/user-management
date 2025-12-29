import jwt from "jsonwebtoken";
import db from "../config/knexInstance.js";
import { generateAccessToken } from "../utils/generateTokens.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!accessToken) {
    const err = new Error("Not Authorized. Invalid access token.");
    err.status = 401;
    throw err;
  }

  try {
    const decodedAccess = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = await db("Users")
      .select("userId", "username", "email", "role")
      .where("userId", decodedAccess.userId)
      .first();
    return next();
  } catch (err) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const err = new Error("Refresh token missing. Please log in again.");
      err.status = 401;
      throw err;
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const newAccessToken = generateAccessToken(decodedRefresh.userId);
      res.setHeader("Authorization", `Bearer ${newAccessToken}`);
      req.user = await db("Users")
        .select("userId", "username", "email", "role")
        .where("userId", decodedRefresh.userId)
        .first();
      return next();
    } catch {
      const err = new Error("Refresh token expired. Please log in.");
      err.status = 403;
      throw err;
    }
  }
};

export default protect;
