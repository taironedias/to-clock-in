// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'to_clock_in',
      timezone: 'UTC'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'to_clock_in',
      user: 'username',
      password: 'password',
      timezone: 'UTC'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
