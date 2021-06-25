const TokenModel = require('./token-model');
const UserModel = require('./user-model');

async function generateAccessToken(user, scope) {
  return TokenModel.generateAccessToken(user, scope);
}

async function getUser(username, password) {
  return UserModel.getUser(username, password);
}

async function saveToken(token, user) {
  return TokenModel.saveToken(token, user);
}

async function getAccessToken(accessToken) {
  return TokenModel.getAccessToken(accessToken);
}

module.exports = {
  generateAccessToken,
  getUser,
  saveToken,
  getAccessToken,
};
