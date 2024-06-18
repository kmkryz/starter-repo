const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool;
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,  // Ensure SSL is used in production
    },
  });
}

// Added for troubleshooting queries during development
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    console.log("executed query", { text });
    return res;
  } catch (error) {
    console.error("error in query", { text });
    throw error;
  }
};

module.exports = {
  query,
  pool, // Export the pool for potential direct use
};
