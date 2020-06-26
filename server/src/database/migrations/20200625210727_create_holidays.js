
exports.up = function(knex) {
    return knex.schema.createTable('holidays', function(table) {
        table.increments();
        table.dateTime('day').notNullable();
        table.string('description').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('holidays');
};
