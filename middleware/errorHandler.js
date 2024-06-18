const utilities = require('../utilities'); // Correct path

const errorHandler = async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500);
  res.render('errors/error', {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  });
};

module.exports = errorHandler;
