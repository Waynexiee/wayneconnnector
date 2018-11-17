const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email must not be empty.";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid.";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password must not be empty.";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.name = "Name must be bewtween 6 and 30 charactors.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
