/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("Teams", (table) => {
    table.increments("teamId").primary();
    table.string("teamName").notNullable().unique();
    // Knex default columns -> created_at + updated_at
    // table.timestamps(true, true);
    // to mimic "timestamps: true" in a Sequelize model definition
    table
      .timestamp("createdAt", { useTz: true })
      .defaultTo(knex.fn.now());
      //.notNullable();
    // useTz - timezone-aware (TIMESTAMPTZ type)
    table
      .timestamp("updatedAt", { useTz: true })
      .defaultTo(knex.fn.now());
      //.notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("Teams");
}
