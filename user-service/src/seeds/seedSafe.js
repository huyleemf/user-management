import db from "../config/sequelize.js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const { User, Team, Roster } = db;

const seedData = async () => {
  try {
    // Sync database without dropping tables
    await db.sequelize.sync();
    console.log("Database synced!");

    // Check if data already exists
    const userCount = await User.count();
    if (userCount > 0) {
      console.log("⚠️  Data already exists. Skipping seed...");
      console.log(`Found ${userCount} users in database.`);
      process.exit(0);
    }

    console.log("Starting seed process...");

    // Create Members
    const members = [];
    for (let i = 0; i < 50; i++) {
      const member = await User.create({
        username: faker.person.firstName() + " " + faker.person.lastName(),
        email: faker.internet.email(),
        password: "Hello01@", // Will be auto-hashed by the beforeCreate hook
        role: "MEMBER",
      });
      members.push(member);
    }
    console.log(`✅ Created ${members.length} members`);

    // Create Managers
    const managers = [];
    for (let i = 0; i < 20; i++) {
      const manager = await User.create({
        username: faker.person.firstName() + " " + faker.person.lastName(),
        email: faker.internet.email(),
        password: "Hello01@", // Will be auto-hashed by the beforeCreate hook
        role: "MANAGER",
      });
      managers.push(manager);
    }
    console.log(`✅ Created ${managers.length} managers`);

    // Create Teams
    const teams = [];
    for (let i = 0; i < 10; i++) {
      const team = await Team.create({
        teamName: `${faker.company.name()} Team`,
      });
      teams.push(team);
    }
    console.log(`✅ Created ${teams.length} teams`);

    // Create Rosters (assign users to teams)
    console.log("Creating rosters...");
    for (const team of teams) {
      // Add 2-3 managers per team
      const teamManagers = faker.helpers.arrayElements(
        managers,
        faker.number.int({ min: 2, max: 3 })
      );
      for (let i = 0; i < teamManagers.length; i++) {
        await Roster.create({
          teamId: team.teamId,
          userId: teamManagers[i].userId,
          isLeader: i === 0, // First manager is the leader
        });
      }

      // Add 3-7 members per team
      const teamMembers = faker.helpers.arrayElements(
        members,
        faker.number.int({ min: 3, max: 7 })
      );
      for (const member of teamMembers) {
        await Roster.create({
          teamId: team.teamId,
          userId: member.userId,
          isLeader: false,
        });
      }
    }
    console.log("✅ Created rosters");

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📝 Default password for all users: Hello01@");
    console.log("\n📊 Summary:");
    console.log(`   - ${members.length} members`);
    console.log(`   - ${managers.length} managers`);
    console.log(`   - ${teams.length} teams`);
    console.log("\n💡 You can now test login with any generated email and password: Hello01@");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
