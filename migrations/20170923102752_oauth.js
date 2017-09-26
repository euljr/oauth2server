function create_oauth_access_tokens(table) {
    table.increments('id').primary();
    table.string('access_token', 256).nullable();
    table.dateTime('expires').nullable();
    table.string('scope', 255).nullable();
    table.integer('client_id').unsigned().nullable();
    table.integer('user_id').unsigned().nullable();
}

function create_oauth_authorization_codes(table) {
    table.increments('id').primary();
    table.string('authorization_code', 256).nullable();
    table.dateTime('expires').nullable();
    table.string('redirect_uri', 2000).nullable();
    table.string('scope', 255).nullable();
    table.integer('client_id').unsigned().nullable();
    table.integer('user_id').unsigned().nullable();
}

function create_oauth_clients(table) {
    table.increments('id').primary();
    table.string('name', 255).nullable();
    table.string('client_id', 80).nullable();
    table.string('client_secret', 80).nullable();
    table.string('redirect_uri', 2000).nullable();
    table.string('grant_types', 80).nullable();
    table.string('scope', 255).nullable();
    table.integer('user_id').unsigned().nullable();
}

function create_oauth_refresh_tokens(table) {
    table.increments('id').primary();
    table.string('refresh_token', 256).nullable();
    table.datetime('expires').nullable();
    table.string('scope', 255).nullable();
    table.integer('client_id').unsigned().nullable();
    table.integer('user_id').unsigned().nullable();
}

function create_oauth_scopes(table) {
    table.increments('id').primary();
    table.string('scope', 80).nullable();
    table.boolean('is_default').nullable();
}

function create_users(table) {
    table.increments('id').primary();
    table.string('username', 32).notNullable();
    table.string('password', 60).notNullable();
    table.string('email', 255).notNullable();
    table.string('fullname', 255).notNullable();
    table.string('scope', 255).nullable();
}

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('oauth_access_tokens', create_oauth_access_tokens),
        knex.schema.createTable('oauth_authorization_codes', create_oauth_authorization_codes),
        knex.schema.createTable('oauth_clients', create_oauth_clients),
        knex.schema.createTable('oauth_refresh_tokens', create_oauth_refresh_tokens),
        knex.schema.createTable('oauth_scopes', create_oauth_scopes),
        knex.schema.createTable('users', create_users)
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('oauth_access_tokens', create_oauth_access_tokens),
        knex.schema.dropTable('oauth_authorization_codes', create_oauth_authorization_codes),
        knex.schema.dropTable('oauth_clients', create_oauth_clients),
        knex.schema.dropTable('oauth_refresh_tokens', create_oauth_refresh_tokens),
        knex.schema.dropTable('oauth_scopes', create_oauth_scopes),
        knex.schema.dropTable('users', create_users)
    ]);
};
