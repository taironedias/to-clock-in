
exports.up = function(knex) {
    return knex.schema.createTable('hours', function(table) {
        table.increments();
        table.integer('user_id').unsigned().notNullable();
        table.dateTime('punch_clock').notNullable();
        
        table.foreign('user_id').references('id').inTable('users');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('hours');
};
