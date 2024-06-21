const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const errorHandler = require('../middleware/errorHandler');
const regValidate = require('../utilities/account-validation')

// GET route for "Login" page
router.get("/login", accountController.getLoginPage);

// GET route for "Registration" page
router.get("/register", accountController.getRegisterPage);

// POST route for "Registration" form submission
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    accountController.registerAccount); // Ensure this line has the correct reference

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

// Process the login attempt
router.post(
    "/register",
    (req, res) => {
      res.status(200).send('register process')
    }
  )

// Error handling middleware
router.use(errorHandler);

module.exports = router;
