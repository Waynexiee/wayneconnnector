const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.name = "Text must be bewtween 10 and 300 charactors.";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text must not be empty.";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid.";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password must not be empty.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
