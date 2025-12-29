/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("Users", (table) => {
    table.uuid("userId").primary();
    table.string("username").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable;
    table
      .enu("role", ["MANAGER", "MEMBER"], {
        useNative: true, // native ENUM type
        enumName: "enum_Users_role",
      })
      .notNullable();
    // Knex default columns -> created_at + updated_at
    // table.timestamps(true, true);
    // to mimic "timestamps: true" in a Sequelize model definition
    table
      .timestamp("createdAt", { useTz: true })
      .defaultTo(knex.fn.now())
      .notNullable();
    // useTz - timezone-aware (TIMESTAMPTZ type)
    table
      .timestamp("updatedAt", { useTz: true })
      .defaultTo(knex.fn.now())
      .notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("Users");
  await knex.schema.raw('DROP TYPE IF EXISTS "enum_Users_role"');
}
