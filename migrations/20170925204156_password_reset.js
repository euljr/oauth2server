function create_password_reset(table) {
    table.increments('id').primary();
    table.string('secret', 130).notNullable();
    table.text('token').notNullable();
    table.dateTime('expires').notNullable();
    table.integer('user_id').unsigned().nullable();
}

function alter_password_reset(table) {
    table.foreign('user_id').references('users.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
}

function undo_alter_password_reset(table) {
    table.dropForeign('user_id');
}

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('password_reset', create_password_reset),
        knex.schema.table('password_reset', alter_password_reset)
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('password_reset', undo_alter_password_reset),
        knex.schema.dropTable('password_reset')
    ]);
};
