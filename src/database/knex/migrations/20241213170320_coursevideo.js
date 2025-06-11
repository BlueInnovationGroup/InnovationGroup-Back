exports.up = knex => knex.schema.createTable("videos", table => {
    table.increments('id').primary();
    table.string("name");
    table.string("ep");
    table.text("description");
    table.text("video");
    table.integer("curso_id").unsigned().notNullable();

    table.foreign('curso_id').references('id').inTable('cursos').onDelete('CASCADE');
    table.timestamp("created_at").default(knex.fn.now());
  });
  
  
  exports.down = knex => knex.schema.dropTable("videos");
  