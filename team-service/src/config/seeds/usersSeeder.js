import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const hashPassword = async (pw) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pw, salt);
  return hashedPassword;
};

export async function seed(knex) {
  //await knex("Users").del();
  const { count } = await knex("Users").count("* as count").first();
  if (parseInt(count, 10) > 0) {
    console.log("Skipping seeding process...");
    return;
  }

  const password = "Hello01@";
  const hashedPassword = await hashPassword(password);
  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      userId: faker.string.uuid(),
      username: faker.person.firstName(),
      email: faker.internet.email(undefined, undefined, "gmail.com"),
      password: hashedPassword,
      role: "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  for (let i = 0; i < 50; i++) {
    users.push({
      userId: faker.string.uuid(),
      username: faker.person.firstName(),
      email: faker.internet.email(undefined, undefined, "gmail.com"),
      password: hashedPassword,
      role: "MANAGER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await knex("Users").insert(users);
  console.log("Seed data inserted.");
}
