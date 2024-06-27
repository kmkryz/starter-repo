const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const errorHandler = require('../middleware/errorHandler');
const regValidate = require('../utilities/account-validation');

// GET route for "Login" page
router.get("/login", accountController.getLoginPage);

// GET route for "Registration" page
router.get("/register", accountController.getRegisterPage);

// POST route for "Registration" form submission
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
);

// GET route for "Account Management" page
router.get("/", accountController.buildAccountManagementView);

// Error handling middleware
router.use(errorHandler);

module.exports = router;
