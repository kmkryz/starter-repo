const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const errorHandler = require('../middleware/errorHandler');

// GET route for "Login" page
router.get("/login", accountController.getLoginPage);

// GET route for "Registration" page
router.get("/register", accountController.getRegisterPage);

// POST route for "Registration" form submission
router.post("/register", accountController.registerAccount); // Ensure this line has the correct reference

// Error handling middleware
router.use(errorHandler);

module.exports = router;
