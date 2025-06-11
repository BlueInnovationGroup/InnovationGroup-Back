exports.up = knex => knex.schema.createTable("usercursos", table => {
  table.increments('id').primary();
  table.integer('user_id').unsigned().notNullable();
  table.integer('curso_id').unsigned().notNullable();
  table.string('status');
  table.string('name');
  table.string('category');
  
  table.foreign('curso_id').references('id').inTable('cursos').onDelete('CASCADE');
  table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

  table.timestamp("created_at").default(knex.fn.now());
});
 //curso em andamento ou completo

exports.down = knex => knex.schema.dropTable("usercursos");