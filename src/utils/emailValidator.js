const validator = require("validator");
const emailValidator = (email, res) => {
if (
    !email ||
    !email.includes("@") ||
    !emailRegex.test(email) ||
    !validator.isEmail(email)
  ) {
    return res.status(400);

    throw new Error("Enter valid email");
  }
}

module.exports = emailValidator;