const { body, validationResult } = require('express-validator');

const isNameValid = (name) => {
  // Define a regular expression pattern that matches only English letters and digits
  var pattern = /^[a-zA-Z0-9]+$/;

  // Use the test() method to check if the inputString matches the pattern
  return pattern.test(name);
}

const isEmailValid = (email) => {
  // Define a regular expression pattern for validating email addresses
  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Use the test() method to check if the email matches the pattern
  return emailPattern.test(email);
}

const isPasswordValid = (password) => {
  // Define regular expressions for each character type
  var uppercaseRegex = /[A-Z]/;
  var lowercaseRegex = /[a-z]/;
  var numberRegex = /[0-9]/;

  // Count how many of the character types are present in the password
  var characterTypesCount = 0;

  if (uppercaseRegex.test(password)) {
    characterTypesCount++;
  }

  if (lowercaseRegex.test(password)) {
    characterTypesCount++;
  }

  if (numberRegex.test(password)) {
    characterTypesCount++;
  }

  // Check if at least three of the character types are present
  return characterTypesCount >= 2 && password.length >= 6;
}

const isSignUpValid = (name, email, password) => {
  if (!isNameValid(name)) {
    return "INVALID_NAME"
  } else if (!isEmailValid(email)) {
    return "INVALID_EMAIL"
  } else if (!isPasswordValid(password)) {
    return "INVALID_PASSWORD"
  } else {
    return "VALID"
  }
}

exports.isSignUpValid = isSignUpValid;
exports.isNameValid = isNameValid;
exports.isEmailValid = isEmailValid;
exports.isPasswordValid = isPasswordValid;

// Middleware for user signup
exports.signupValidation = [
  body('name').custom((value) => {
    if (!isNameValid(value)) {
      throw new Error('Invalid name');
    }
    return true;
  }),
  body('email').custom((value) => {
    if (!isEmailValid(value)) {
      throw new Error('Invalid email');
    }
    return true;
  }),
  body('password').custom((value) => {
    if (!isPasswordValid(value)) {
      throw new Error('Invalid password');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
