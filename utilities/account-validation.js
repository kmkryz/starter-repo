const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() 
      .withMessage("A valid email is required."),
      // .custom(async (account_email) => {
      //   const emailExists = await accountModel.checkExistingEmail(account_email)
      //   if (emailExists){
      //     throw new Error("Email exists. Please log in or use different email")
      //   }
      //   }),

  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isLength({ min: 12 })
        .withMessage("Password must be at least 12 characters long.")
        .matches(/\d/)
        .withMessage("Password must contain a number.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter.")
        .matches(/[^a-zA-Z0-9]/)
        .withMessage("Password must contain a special character."),
    ]
  }



/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Please enter your password."),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
      
    });
    return;
  }
  next();
};

// Update account validation rules
validate.updateAccountRules = () => {
  return [
    body("account_firstname").notEmpty().withMessage("First name is required."),
    body("account_lastname").notEmpty().withMessage("Last name is required."),
    body("account_email")
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const accountId = req.params.accountId;
        const accountData = await accountModel.getAccountById(accountId);
        if (accountData.account_email !== account_email) {
          const emailExists = await accountModel.checkExistingEmail(account_email);
          if (emailExists) {
            throw new Error("Email already exists.");
          }
        }
      }),
  ];
};

// Password change validation rules
validate.passwordChangeRules = () => {
  return [
    body("new_password")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/\d/)
      .withMessage("Password must contain a number.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter.")
      .matches(/[^a-zA-Z0-9]/)
      .withMessage("Password must contain a special character."),
    body("confirm_new_password")
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          throw new Error("Password confirmation does not match password.");
        }
        return true;
      }),
  ];
};

// Check update account data
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.params.accountId);
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
      accountData,
    });
    return;
  }
  next();
};

// Check password change data
validate.checkPasswordChangeData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.params.accountId);
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
      accountData,
    });
    return;
  }
  next();
};

module.exports = validate