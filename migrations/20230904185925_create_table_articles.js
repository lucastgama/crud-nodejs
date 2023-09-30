/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("articles", (table) => {
    table.increments("id").primary();
    table.string("name").notNull();
    table.string("description", 1000).notNull();
    table.string("imageUrl", 1000);
    table.binary("content").notNull();
    table.integer("userId").unsigned().notNull(); // Defina a coluna userId como notNull() aqui.
    table.foreign("userId").references("id").inTable("users");

    table.integer("categoryId").unsigned().notNull(); // Defina a coluna categoryId como notNull() aqui.
    table.foreign("categoryId").references("id").inTable("categories");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("articles");
};
