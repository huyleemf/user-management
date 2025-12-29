import Joi from "joi";

export const teamSchema = Joi.object({
  teamName: Joi.string().trim().min(1).required(),
  managers: Joi.array().items(
    Joi.object({
      managerId: Joi.string()
        .guid({
          version: ["uuidv4", "uuidv5"],
        })
        .required(),
      managerName: Joi.string().required(),
    })
  ),
  members: Joi.array().items(
    Joi.object({
      memberId: Joi.string()
        .guid({
          version: ["uuidv4", "uuidv5"],
        })
        .required(),
      memberName: Joi.string().required(),
    })
  ),
});

export const memberSchema = Joi.object({
  memberId: Joi.string()
    .guid({
      version: ["uuidv4", "uuidv5"],
    })
    .required(),
  memberName: Joi.string().required(),
});

export const managerSchema = Joi.object({
  managerId: Joi.string()
    .guid({
      version: ["uuidv4", "uuidv5"],
    })
    .required(),
  managerName: Joi.string().required(),
});
