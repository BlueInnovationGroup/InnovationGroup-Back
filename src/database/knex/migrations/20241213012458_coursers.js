exports.up = knex => knex.schema.createTable("cursos", table => {
    table.increments('id').primary();
    table.string("name");
    table.string("category");
    table.text("description");
    table.integer("quantity");
  
    table.timestamp("created_at").default(knex.fn.now());
  });
  
  
  exports.down = knex => knex.schema.dropTable("cursos");
  