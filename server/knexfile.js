// Update with your config settings.
const moment = require('moment');

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'to_clock_in',
      timezone: 'UTC',
      typeCast: function (field, next) {
        if (field.type == 'DATETIME') {
          return moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
        }
        return next();
      }
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
      directory: './src/database/migrations'
    }
  }

};
