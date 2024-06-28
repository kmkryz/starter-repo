const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
  
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
  
};

invCont.buildByInventoryId = async function (req, res, next) {
  
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getInventoryById(inventory_id);
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
  
};

/* ***************************
 *  Build Inventory Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } ;

/* ***************************
 *  Get Add Classification Page
 * ************************** */
invCont.getAddClassificationPage = async function (req, res, next) {
  
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  
};

/* ***************************
 *  Add New Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

 
    const addResult = await invModel.addClassification(classification_name);

    if (addResult.rowCount === 1) {
      req.flash("notice", `Classification "${classification_name}" added successfully.`);
      nav = await utilities.getNav(); 
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Failed to add classification.");
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      });
    
  } 
};

/* ***************************
 *  Get Add Inventory Page
 * ************************** */
invCont.getAddInventoryPage = async function (req, res, next) {
  
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
    });
};

/* ***************************
 *  Add New Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;


    const addResult = await invModel.addInventory(
      classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    );

    if (addResult.rowCount === 1) {
      req.flash("notice", `Vehicle "${inv_make} ${inv_model}" added successfully.`);
      nav = await utilities.getNav();
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Failed to add vehicle.");
      let classificationList = await utilities.buildClassificationList(classification_id);
      res.status(500).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
        errors: null,
      });
    
  } 
};

module.exports = invCont;
