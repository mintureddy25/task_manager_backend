const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, secretKey);
}

module.exports = {
  generateToken
};