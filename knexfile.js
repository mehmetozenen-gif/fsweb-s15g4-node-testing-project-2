
const path = require('path');

const sharedConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'data/migrations'),
  },
  seeds: {
    directory: path.join(__dirname, 'data/seeds'),
  },
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: {
      filename: path.join(__dirname, 'data/development.db3'),
    },
  },

  testing: {
    ...sharedConfig,
    connection: {
      filename: path.join(__dirname, 'data/testing.db3'),
    },
  },
};
