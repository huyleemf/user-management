import { getInfo } from "./getInfo.js";

export const processArray = async (
  trx,
  teamId,
  userList,
  currentUserId,
  currentRole
) => {
  const idField = `${currentRole}Id`;
  const nameField = `${currentRole}Name`;
  const processedArray = [];
  if (!Array.isArray(userList) || userList.length === 0) return processedArray;
  for (const user of userList) {
    if (user[idField] === currentUserId) continue;
    const userInfo = await getInfo(trx, "Users", user[idField]);

    console.log(userInfo);

    if (!userInfo || userInfo.role !== currentRole.toUpperCase()) {
      const err = new Error(
        `This ${currentRole} ${user[idField]} does not exist.`
      );
      err.status = 400;
      throw err;
    }

    if (userInfo.username !== user[nameField]) {
      const err = new Error(
        `This ${currentRole}'s name ${user[nameField]} is incorrect.`
      );
      err.status = 400;
      throw err;
    }

    await trx("Rosters")
      .insert({ teamId: teamId, userId: user[idField] })
      .returning(["teamId", "userId"]);

    processedArray.push({
      [idField]: userInfo.userId,
      [nameField]: userInfo.username,
    });
  }
  return processedArray;
};
