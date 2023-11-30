const jwt = require('jsonwebtoken');

const authenticateToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    return user
  } catch (err) {
    return err
  }
}

const generateAccessToken = (user) => {
  const expiresIn = '1h';
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
  return { token, expiresIn };
}

exports.authenticateToken = authenticateToken;
exports.generateAccessToken = generateAccessToken;