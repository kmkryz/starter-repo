const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId); 
router.get("/", invController.buildManagementView);
// Route for add classification page
router.get("/add-classification", invController.getAddClassificationPage);

// Route for handling add classification form submission
router.post("/add-classification", invController.addClassification);

// Route to display add inventory form
router.get("/add-inventory", invController.getAddInventoryPage);

// Route to process add inventory form
router.post("/add-inventory", invController.addInventory);


// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

module.exports = router;
