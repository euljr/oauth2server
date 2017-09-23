function alter_oauth_access_tokens(table) {
    table.foreign('client_id').references('oauth_clients.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    table.foreign('user_id').references('users.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
}

function alter_oauth_authorization_codes(table) {
    table.foreign('client_id').references('oauth_clients.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    table.foreign('user_id').references('users.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
}

function alter_oauth_clients(table) {
    table.foreign('user_id').references('users.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
}

function alter_oauth_refresh_tokens(table) {
    table.foreign('client_id').references('oauth_clients.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    table.foreign('user_id').references('users.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
}

function undo_alter_oauth_access_tokens(table) {
    table.dropForeign('client_id');
    table.dropForeign('user_id');
}

function undo_alter_oauth_authorization_codes(table) {
    table.dropForeign('client_id');
    table.dropForeign('user_id');
}

function undo_alter_oauth_clients(table) {
    table.dropForeign('user_id');
}

function undo_alter_oauth_refresh_tokens(table) {
    table.dropForeign('client_id');
    table.dropForeign('user_id');
}

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('oauth_access_tokens', alter_oauth_access_tokens),
        knex.schema.table('oauth_authorization_codes', alter_oauth_authorization_codes),
        knex.schema.table('oauth_clients', alter_oauth_clients),
        knex.schema.table('oauth_refresh_tokens', alter_oauth_refresh_tokens)
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('oauth_access_tokens', undo_alter_oauth_access_tokens),
        knex.schema.table('oauth_authorization_codes', undo_alter_oauth_authorization_codes),
        knex.schema.table('oauth_clients', undo_alter_oauth_clients),
        knex.schema.table('oauth_refresh_tokens', undo_alter_oauth_refresh_tokens)
    ]);
};
