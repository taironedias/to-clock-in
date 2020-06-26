
exports.up = function(knex) {
    return knex.schema.createTable('users_config', function(table) {
        table.integer('idUser').unsigned().notNullable();
        table.integer('amount');
        table.integer('amountGoal');
        table.integer('hoursGoal');
        table.dateTime('start');
        table.dateTime('end');
        
        table.foreign('idUser').references('id').inTable('users');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users_config');
};
