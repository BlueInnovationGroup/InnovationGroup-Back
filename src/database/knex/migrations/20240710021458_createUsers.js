exports.up = knex => knex.schema.createTable("users", table => {
  table.increments('id').primary();
  table.boolean("isadmin").defaultTo(false);
  table.string("firstname");
  table.string("lastname");
  table.string("password");
  table.string("email").unique();;
  table.string("nick").unique();;

  table.text("avatar");
  table.string('phone');
  table.string('country');
  table.string('states');
  table.string('city');
  table.string('postal');
  table.string('address1');
  table.string('address2');
  
  table.string('enterprise');
  table.string('iva');

  table.timestamp("created_at").default(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("users");
