const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "School must not be empty.";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree must not be empty.";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From must not be empty.";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study must not be empty.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
