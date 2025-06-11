exports.up = knex => knex.schema.createTable("password_resets", table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('code').notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp("created_at").default(knex.fn.now());
  });
  
  exports.down = knex => knex.schema.dropTable("password_resets");
  