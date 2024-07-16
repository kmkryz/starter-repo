const express = require("express");
const utilities = require("../utilities");
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
router.get("/", utilities.checkLogin, accountController.buildAccountManagementView);

// Add this route for updating account information
router.get("/update/:accountId", utilities.checkLogin, accountController.getUpdateAccountPage);

// Add this route to handle account information update
router.post("/update/:accountId", utilities.checkLogin, regValidate.updateAccountRules(), regValidate.checkUpdateData, accountController.updateAccount);

// Add this route to handle password change
router.post("/change-password/:accountId", utilities.checkLogin, regValidate.passwordChangeRules(), regValidate.checkPasswordChangeData, accountController.changePassword);

// Add this route for logging out
router.get("/logout", accountController.logout);

// Add routes for comments
router.get("/comments/:accountId", utilities.checkLogin, accountController.getCommentsPage);
router.post("/comments/:accountId", utilities.checkLogin, accountController.addComment);

// Error handling middleware
router.use(errorHandler);

module.exports = router;