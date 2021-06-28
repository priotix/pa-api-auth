const bluebird = require('bluebird');
const config = require('config');
const Mongoose = bluebird.promisifyAll(require('mongoose'));
const JWT = require('jsonwebtoken');

const BadRequestError = require('../../libs/errors/base-error');
const TokenExpiredError = require('../../libs/errors/token-expired-error');

const TokenSchema = new Mongoose.Schema(
  {
    accessToken: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    scope: String,
  },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000,
    },
  },
);

let TokenModel;
let UserModel;

TokenSchema.statics.verifyToken = async function verifyToken(token, options = {}) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, config.get('secret'), options, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

TokenSchema.statics.generateAccessToken = async function generateAccessToken(user, userId) {
  console.log(`Generating access token for user: ${user.id}`);
  const secret = config.get('secret');
  const context = { userId };
  const payload = {
    user,
    context,
  };

  const opt = { algorithm: 'HS256' };

  return JWT.sign(payload, secret, opt);
};

TokenSchema.statics.saveToken = async function saveToken(token, user) {
  console.log(`Saving token for user: ${user.id}`);
  const accessToken = new TokenModel({
    accessToken: token.accessToken,
    user: user.id,
  });

  return accessToken.save();
};

TokenSchema.statics.getAccessToken = async function getAccessToken(accessToken) {
  console.log('Getting access token');
  try {
    await TokenModel.verifyToken(accessToken);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new TokenExpiredError('Token is expired', 'token');
    }

    throw new BadRequestError(`Access token is invalid: ${err.message}`, 'token');
  }

  const token = await TokenModel.findOne({ accessToken });

  if (!token) {
    throw new BadRequestError('Token is invalid', 'token');
  }
  const user = await UserModel.findById(token.user);

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt: new Date(config.get('expirationYear')),
    user,
  };
};

TokenModel = Mongoose.model('Token', TokenSchema);

module.exports = TokenModel;

UserModel = require('./user-model');
