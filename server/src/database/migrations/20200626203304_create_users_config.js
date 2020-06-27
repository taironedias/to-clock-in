
exports.up = function(knex) {
    return knex.schema.createTable('users_config', function(table) {
        table.integer('user_id').unsigned().notNullable();
        table.integer('amount');
        table.integer('amount_goal');
        table.integer('hours_goal');
        table.dateTime('start');
        table.dateTime('end');
        
        table.foreign('user_id').references('id').inTable('users');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users_config');
};
