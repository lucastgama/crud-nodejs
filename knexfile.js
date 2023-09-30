module.exports = {
  client: "mysql2",
  connection: {
    database: "knowledge",
    user: "root",
    password: "123456",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
