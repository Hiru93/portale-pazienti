require('dotenv').config();
console.log(
  '@@@@ process.env.PP_LOADED_ENV: ' + process.env.PP_LOADED_ENV + ' @@@@',
);

const connectionConfig = {
  host: process.env.PP_PG_HOST,
  user: process.env.PP_PG_USER,
  password: process.env.PP_PG_PASS,
  database: process.env.PP_PG_DB,
  port: parseInt(process.env.PP_PG_PORT || '5433'),
};

module.exports = {
  development: {
    client: 'pg',
    connection: {
      ...connectionConfig,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
    },
    schema: 'public',
  },
};
