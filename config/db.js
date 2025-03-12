// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "yupiter",
//   password: "oqbolayev",
//   port: 5432,
// });

// module.exports = pool;

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: 'postgresql://javohir:qMgKXWjCWQoKhRPEoVJ2KVFQBs6iJwWE@dpg-cv4pllvnoe9s73centog-a.oregon-postgres.render.com/yupiter_1311',
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

module.exports = pool;
