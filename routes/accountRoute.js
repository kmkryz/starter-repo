const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController"); 
const errorHandler = require('../middleware/errorHandler');


router.get("/login", accountController.getLoginPage); 


router.use(errorHandler);

module.exports = router;
