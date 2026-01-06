import db from "../config/knexInstance.js";
import {
  teamSchema,
  memberSchema,
  managerSchema,
} from "../schemas/joiSchemas.js";
import { checkExistence } from "../utils/checkExistence.js";
import { processArray } from "../utils/processArray.js";
import { processRequestBody } from "../utils/processRequestBody.js";

// managed transactions handle committing or rolling back the transaction automatically
const createTeam = async (req, res, next) => {
  const { error, value } = teamSchema.validate(req.body);
  if (error) {
    error.status = 400;
    return next(error);
  }

  const { teamName, managers, members } = value;
  const userId = req.user.userId;

  try {
    const result = await db.transaction(async (trx) => {
      const isTeamFound = await trx("Teams").where({ teamName }).first();
      if (isTeamFound) {
        const err = new Error("This team already exists.");
        err.status = 400;
        throw err;
      } else if (!isTeamFound) {
        const newTeam = await trx("Teams")
          .insert({ teamName })
          .returning(["teamId", "teamName"]);

        console.log(newTeam);

        const newLeader = await trx("Rosters")
          .insert({
            teamId: newTeam[0].teamId,
            userId: userId,
            isLeader: true,
          })
          .returning(["teamId", "isLeader", "userId"]);

        console.log(newLeader);

        const managerList = await processArray(
          trx,
          newTeam[0].teamId,
          managers,
          userId,
          "manager"
        );

        const memberList = await processArray(
          trx,
          newTeam[0].teamId,
          members,
          userId,
          "member"
        );

        return {
          teamId: newTeam[0].teamId,
          teamName: newTeam[0].teamName,
          managers: managerList,
          members: memberList,
        };
      }
    });
    return res.status(201).json(result);
  } catch (err) {
    //console.log(err);
    next(err);
  }
};

const getTeams = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    const isUserValid = await db("Users").where({ userId }).first();
    if (!isUserValid) {
      const err = new Error(`You are not allowed to view teams.`);
      err.status = 400;
      throw err;
    }

    const result = await db("Teams as t")
      .innerJoin("Rosters as r", "t.teamId", "r.teamId")
      .innerJoin("Users as u", "r.userId", "u.userId")
      .select(
        "t.teamId",
        "t.teamName",
        "u.userId",
        "u.username",
        "u.role",
        "r.isLeader"
      )
      .orderBy("t.teamId");

    if (!result || !result.length) {
      const err = new Error(`Teams are not found.`);
      err.status = 400;
      throw err;
    }

    // Group by teamId
    const teamsMap = {};

    result.forEach((row) => {
      if (!teamsMap[row.teamId]) {
        teamsMap[row.teamId] = {
          teamId: row.teamId,
          teamName: row.teamName,
          teamLeader: null,
          managers: [],
          members: [],
        };
      }

      if (row.isLeader) {
        teamsMap[row.teamId].teamLeader = {
          userId: row.userId,
          username: row.username,
        };
      } else if (row.role === "MANAGER") {
        teamsMap[row.teamId].managers.push({
          managerId: row.userId,
          managerName: row.username,
        });
      } else if (row.role === "MEMBER") {
        teamsMap[row.teamId].members.push({
          memberId: row.userId,
          memberName: row.username,
        });
      }
    });

    // Convert to array
    const teams = Object.values(teamsMap);

    return res.status(200).json(teams);
  } catch (err) {
    next(err);
  }
};
const getTeam = async (req, res, next) => {
  const { teamId } = req.params;
  const userId = req.user.userId;
  try {
    const isUserValid = await db("Rosters").where({ teamId, userId }).first();
    if (!isUserValid) {
      const err = new Error(`You are not allowed to view this team.`);
      err.status = 400;
      throw err;
    }

    const result = await db("Teams as t")
      .innerJoin("Rosters as r", "t.teamId", "r.teamId")
      .innerJoin("Users as u", "r.userId", "u.userId")
      .select(
        "t.teamId",
        "t.teamName",
        "u.userId",
        "u.username",
        "u.role",
        "r.isLeader"
      )
      .where("t.teamId", teamId);

    if (!result || !result.length) {
      const err = new Error(`Team is not found.`);
      err.status = 400;
      throw err;
    }

    const output = {
      teamId: result[0].teamId,
      teamName: result[0].teamName,
      teamLeader: null,
      managers: [],
      members: [],
    };

    result.forEach((row) => {
      if (row.isLeader) {
        output.teamLeader = {
          userId: row.userId,
          username: row.username,
        };
      } else if (row.role === "MANAGER") {
        output.managers.push({
          managerId: row.userId,
          managerName: row.username,
        });
      } else if (row.role === "MEMBER") {
        output.members.push({
          memberId: row.userId,
          memberName: row.username,
        });
      }
    });

    return res.status(200).json(output);
  } catch (err) {
    next(err);
  }
};

const removeTeam = async (req, res, next) => {
  const { teamId } = req.params;
  const userId = req.user.userId;
  try {
    const { isLeader } = await db("Rosters").where({ teamId, userId }).first();
    if (isLeader) await db("Teams").where({ teamId }).del();

    return res.status(204).json({ teamId });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  const { error, value } = memberSchema.validate(req.body);
  if (error) {
    error.status = 400;
    return next(error);
  }

  const { memberId, memberName } = value;
  const { teamId } = req.params;

  try {
    const task = await processRequestBody(
      db,
      teamId,
      memberId,
      memberName,
      "member"
    );
    console.log(task);

    const result = {
      teamId,
      memberId,
      memberName,
    };

    return res.status(201).json(result);
  } catch (err) {
    //console.log(err);
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  const { teamId, memberId } = req.params;
  try {
    await checkExistence(db, teamId, memberId, "member");

    const task = await db("Rosters").where({ teamId, userId: memberId }).del();
    console.log(task);

    return res.status(204).json({ memberId });
  } catch (err) {
    //console.log(err);
    next(err);
  }
};

const addManager = async (req, res, next) => {
  const { error, value } = managerSchema.validate(req.body);
  if (error) {
    error.status = 400;
    return next(error);
  }

  const { managerId, managerName } = value;
  const { teamId } = req.params;

  try {
    const task = await processRequestBody(
      db,
      teamId,
      managerId,
      managerName,
      "manager"
    );
    console.log(task);

    const result = {
      teamId,
      managerId,
      managerName,
    };

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const removeManager = async (req, res, next) => {
  const { teamId, managerId } = req.params;
  try {
    await checkExistence(db, teamId, managerId, "manager");

    if (managerId === req.user.userId) {
      const err = new Error(`Leader can't be removed from a team.`);
      err.status = 400;
      throw err;
    }

    const task = await db("Rosters").where({ teamId, userId: managerId }).del();
    console.log(task);

    return res.status(204).json({ managerId });
  } catch (err) {
    next(err);
  }
};

export {
  createTeam,
  getTeams,
  getTeam,
  removeTeam,
  addMember,
  removeMember,
  addManager,
  removeManager,
};
