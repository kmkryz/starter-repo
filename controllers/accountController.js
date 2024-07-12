const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {};

accountController.getLoginPage = async function (req, res, next) {
  
    let nav = await utilities.getNav();
    res.render("account/login", { 
      title: "Login",
      nav,
      errors: null,
    });
   
};


/* ***************************
 *  Get Registration Page
 * ************************** */
accountController.getRegisterPage = async function (req, res, next) { 
 
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      
    });
   
};

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      locals: { account_firstname, account_lastname, account_email }
    });
    return;
  }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult.rowCount === 1) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        locals: { account_firstname, account_lastname, account_email }
      });
    }
  // } catch (error) {
  //   req.flash("notice", "Sorry, the registration failed.");
  //   res.status(501).render("account/register", {
  //     title: "Registration",
  //     nav,
  //     messages: req.flash('notice'),
  //     locals: { account_firstname, account_lastname, account_email }
  //   });
  // }
};


/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }



/* ****************************************
*  Build Account Management View
* *************************************** */
accountController.buildAccountManagementView = async function (req, res, next) {
  
    let nav = await utilities.getNav();
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  
};

// Add this method to render the update account page
accountController.getUpdateAccountPage = async function (req, res, next) {
  let nav = await utilities.getNav();
  const accountId = req.params.accountId;
  const accountData = await accountModel.getAccountById(accountId);

  if (!accountData) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account");
  }

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  });
};

// Method to handle account information update
accountController.updateAccount = async function (req, res) {
  const { account_firstname, account_lastname, account_email } = req.body;
  const accountId = req.params.accountId;
  let nav = await utilities.getNav();

  try {
    const updateResult = await accountModel.updateAccount(accountId, account_firstname, account_lastname, account_email);
    if (updateResult.rowCount === 1) {
      req.flash("notice", "Account information updated successfully.");
      const updatedAccountData = await accountModel.getAccountById(accountId);
      res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: updatedAccountData,
      });
    } else {
      req.flash("notice", "Failed to update account information.");
      return res.redirect(`/account/update/${accountId}`);
    }
  } catch (error) {
    req.flash("notice", "An error occurred while updating account information.");
    return res.redirect(`/account/update/${accountId}`);
  }
};

// Method to handle password change
accountController.changePassword = async function (req, res) {
  const { current_password, new_password } = req.body;
  const accountId = req.params.accountId;
  let nav = await utilities.getNav();

  try {
    const accountData = await accountModel.getAccountById(accountId);
    if (!accountData || !(await bcrypt.compare(current_password, accountData.account_password))) {
      req.flash("notice", "Current password is incorrect.");
      return res.redirect(`/account/update/${accountId}`);
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    const updateResult = await accountModel.updatePassword(accountId, hashedPassword);
    if (updateResult.rowCount === 1) {
      req.flash("notice", "Password changed successfully.");
      const updatedAccountData = await accountModel.getAccountById(accountId);
      res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: updatedAccountData,
      });
    } else {
      req.flash("notice", "Failed to change password.");
      return res.redirect(`/account/update/${accountId}`);
    }
  } catch (error) {
    req.flash("notice", "An error occurred while changing password.");
    return res.redirect(`/account/update/${accountId}`);
  }
};

// Add this method to handle the logout process
accountController.logout = async function (req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
};

module.exports = accountController;