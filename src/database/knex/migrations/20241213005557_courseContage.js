exports.up = knex => knex.schema.createTable("cursocontagem", table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('curso_id').unsigned().notNullable();
    table.integer('video_id').unsigned().notNullable();
    
    table.foreign('curso_id').references('id').inTable('cursos').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('video_id').references('id').inTable('videos').onDelete('CASCADE');

    table.timestamp("created_at").default(knex.fn.now());
});
  
//video aula completa
exports.down = knex => knex.schema.dropTable("cursocontagem");
  