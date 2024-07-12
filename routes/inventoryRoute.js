const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");


router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId); 
router.get("/", utilities.checkLogin, invController.buildManagementView);
// Route for add classification page
router.get("/add-classification", utilities.checkAccountType, invController.getAddClassificationPage);

// Route for handling add classification form submission
router.post("/add-classification", utilities.checkAccountType, invController.addClassification);

// Route to display add inventory form
router.get("/add-inventory", utilities.checkAccountType, invController.getAddInventoryPage);

// Route to process add inventory form
router.post("/add-inventory", utilities.checkAccountType, invController.addInventory);


// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Route to render the edit inventory view
router.get("/edit/:inv_id", utilities.checkAccountType, invController.editInventoryView);

// Route to handle the update inventory request
router.post("/update", utilities.checkAccountType, utilities.checkUpdateData, invController.updateInventory);

// Route to render the delete confirmation view
router.get("/delete/:inv_id", utilities.checkAccountType, invController.deleteInventoryView);

// Route to handle the delete inventory request
router.post("/delete", utilities.checkAccountType, invController.deleteInventory);

module.exports = router;