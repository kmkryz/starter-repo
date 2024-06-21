const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data.length > 0 ? data[0].classification_name : "Unknown";
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    console.log("buildByInventoryId called"); // Log statement
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getInventoryById(inventory_id);
    console.log(data); // Log the data to verify it is being retrieved
    if (!data) {
      return next({ status: 404, message: "Vehicle not found" });
    }
    const detail = await utilities.buildInventoryDetail(data);
    let nav = await utilities.getNav();
    const title = `${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/detail", {
      title,
      nav,
      detail,
    });
  } catch (error) {
    next(error);
  }
};


/* ***************************
 *  Build Inventory Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav
    });
  } catch (error) {
    next(error);
  }
};



module.exports = invCont;
