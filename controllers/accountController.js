const utilities = require("../utilities");

const accountController = {};

/* ***************************
 *  Get Login Page
 * ************************** */
accountController.getLoginPage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", { // Updated to render login.ejs
      title: "Login",
      nav
    });
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;
