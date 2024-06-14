const errorController = {};

/* ***************************
 *  Trigger intentional error
 * ************************** */
errorController.triggerError = function (req, res, next) {
  try {
    throw new Error("Intentional Server Error for testing");
  } catch (error) {
    next(error);
  }
};

module.exports = errorController;
