import db from "../config/knexInstance.js";
import dotenv from "dotenv";
dotenv.config();

const authorizeRoles = async (req, res, next) => {
  if (!req.user) {
    const err = new Error("Not authenticated.");
    err.status = 401;
    throw err;
  }

  const { role } = req.user;

  if (role === "MANAGER") {
    const match = req.route.path.match(/\/managers\b/);
    const managersSegment = match ? true : false;
    if (managersSegment) {
      const { teamId } = req.params;
      const currentRoster = await db("Rosters")
        .where({ teamId, userId: req.user.userId })
        .first();
      if (!currentRoster) {
        const err = new Error(`Team with ID ${teamId} does not exist.`);
        err.status = 403;
        throw err;
      }
      if (!currentRoster.isLeader) {
        const err = new Error("Only the Lead Manager may perform this action.");
        err.status = 403;
        throw err;
      }
    }
    return next();
  } else {
    const err = new Error(
      "Access to this route is not permitted for a member."
    );
    err.status = 403;
    throw err;
  }
};

export default authorizeRoles;
