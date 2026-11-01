
exports.up = function (knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.float('price').notNullable();
    table.integer('stock').notNullable().defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('products');
};
