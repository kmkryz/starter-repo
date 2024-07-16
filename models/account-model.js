const pool = require("../database");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
      const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

// Add this method to get account data by ID
async function getAccountById(accountId) {
  try {
    const result = await pool.query("SELECT * FROM account WHERE account_id = $1", [accountId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    return null;
  }
}

// Method to update account information
async function updateAccount(accountId, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, accountId]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Method to update account password
async function updatePassword(accountId, hashedPassword) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [hashedPassword, accountId]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Function to add a comment
async function addComment(accountId, commentText) {
  try {
    const sql = "INSERT INTO comments (account_id, comment_text) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(sql, [accountId, commentText]);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

// Function to get comments by account ID
async function getCommentsByAccountId(accountId) {
  try {
    const sql = "SELECT * FROM comments WHERE account_id = $1 ORDER BY comment_date DESC";
    const result = await pool.query(sql, [accountId]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Export the registerAccount function
module.exports = {
  registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, addComment, getCommentsByAccountId
};