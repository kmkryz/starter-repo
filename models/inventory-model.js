const pool = require("../database/");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
  }
}

async function getInventoryById(inventory_id) {
  try {
    console.log("getInventoryById called with id:", inventory_id); // Log statement
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inventory_id]
    );
    console.log("Query result:", data.rows); // Log the result
    return data.rows[0]; // Since it's a single item, return the first row
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById };
