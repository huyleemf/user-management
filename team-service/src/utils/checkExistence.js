import { getInfo } from "./getInfo.js";

export const checkExistence = async (db, teamId, userId, role) => {
  const teamInfo = await db("Teams")
    .where({
      teamId,
    })
    .first();

  const userInfo = await getInfo(db, "Users", userId);

  if (!teamInfo || !userInfo) {
    const err = new Error(`Team or user is not found.`);
    err.status = 400;
    throw err;
  }

  if (userInfo.role !== role.toUpperCase()) {
    const err = new Error(
      `This user cannot be added or removed through this route.`
    );
    err.status = 400;
    throw err;
  }

  return userInfo;
};
