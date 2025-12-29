import { getInfo } from "./getInfo.js";

export const processRequestBody = async (
  db,
  teamId,
  userId,
  userName,
  role
) => {
  const userInfo = await getInfo(db, "Users", userId);
  if (!userInfo || userInfo.username !== userName) {
    const err = new Error(
      `${role} with ID ${userId} was not found or the username does not match.`
    );
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

  const isTeamFound = await db("Teams")
    .where({
      teamId,
    })
    .first();

  if (!isTeamFound) {
    const err = new Error(`Team with ID ${teamId} does not exist.`);
    err.status = 400;
    throw err;
  }

  const isUserFound = await db("Rosters")
    .join("Teams", "Rosters.teamId", "Teams.teamId")
    .select("Rosters.*", "Teams.teamName")
    .where({
      "Rosters.teamId": teamId,
      "Rosters.userId": userId,
    })
    .first();

  if (isUserFound) {
    const err = new Error(
      `This user already joined team ${isUserFound.teamName} (ID: ${teamId}).`
    );
    err.status = 400;
    throw err;
  }

  const result = await db("Rosters")
    .insert({ teamId, userId })
    .returning(["teamId", "userId"]);
  return result;
};
