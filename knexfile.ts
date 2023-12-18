import type { Knex } from "knex";
import path from "path";

// Update with your config settings.

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: path.resolve(__dirname, "database", "database.sqlite"),
    },
    migrations: {
      directory: path.resolve(__dirname, "database", "migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "database", "seeds"),
    },
    pool: {
      afterCreate: (connection: any, done: Function) => {
        connection.run("PRAGMA foreign_keys = ON");
        done();
      },
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports = config;
