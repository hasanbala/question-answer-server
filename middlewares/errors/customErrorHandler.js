const CustomError = require("../../helpers/error/CustomError");
const customErrorHandler = (err, _req, res, _next) => {
  // console.log("Custom Error Handler");
  let customError = err;

  if (err.name === "SyntaxError") {
    customError = new CustomError("Unexpected Syntax", 400);
  }

  if (err.name === "ValidationError") {
    customError = new CustomError(err.message, 400);
  }

  if (err.name === "CastError") {
    customError = new CustomError("Please provide a valid id", 400);
  }

  if (err.code === 11000) {
    customError = new CustomError("Duplicate Key Found: check your input", 400);
  }

  res.status(customError.status || 500).json({
    success: false,
    message: customError.message,
  });
};

module.exports = customErrorHandler;
