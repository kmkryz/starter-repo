
const utilities = require("../utilities");
const accountModel = require("../models/account-model");

const accountController = {};

/* ***************************
 *  Get Login Page
 * ************************** */
accountController.getLoginPage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", { 
      title: "Login",
      nav
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Get Registration Page
 * ************************** */
accountController.getRegisterPage = async function (req, res, next) { 
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult.rowCount === 1) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  } catch (error) {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
};

module.exports = accountController;
