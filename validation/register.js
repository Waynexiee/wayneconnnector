const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be bewtween 2 and 30 charactors.";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name must not be empty.";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email must not be empty.";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email must not be empty.";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password must not be empty.";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be bewtween 6 and 30 charactors.";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password is required.";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Confirm password is not right.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
