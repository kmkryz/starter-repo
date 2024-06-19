const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController"); // Ensure correct path
const errorHandler = require('../middleware/errorHandler');

// GET route for "Login" page
router.get("/login", accountController.getLoginPage); // Updated route handler

// Error handling middleware
router.use(errorHandler);

module.exports = router;
