const { check, validationResult } = require('express-validator');

const validateClassification = [
  check('classification_name')
    .isAlphanumeric().withMessage('Classification name cannot contain spaces or special characters.')
    .not().isEmpty().withMessage('Classification name is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(error => ({ type: 'error', msg: error.msg }));
      req.flash('notice', messages);
      return res.redirect('/inv/add-classification');
    }
    next();
  }
];

module.exports = {
  validateClassification
};
