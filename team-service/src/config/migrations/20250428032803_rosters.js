/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("Rosters", (table) => {
    table.increments("rosterId").primary();
    table
      .integer("teamId")
      .notNullable()
      .references("teamId")
      .inTable("Teams")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .uuid("userId")
      .references("userId")
      .inTable("Users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.boolean("isLeader").notNullable().defaultTo(false);
    /*
    table.index(["teamId"], "idx_rosters_team");
    table.index(["userId"], "idx_rosters_user");
     */
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("Rosters");
}
