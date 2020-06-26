
exports.up = function(knex) {
    return knex.schema.createTable('hours', function(table) {
        table.increments();
        table.integer('idUser').unsigned().notNullable();
        table.dateTime('punchClock').notNullable();
        
        table.foreign('idUser').references('id').inTable('users');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('hours');
};
