const lodash = require('lodash');
const { Request, oauth2, authServer } = require('../../libs/oauth2.js');

const UserModel = require('../models/user-model');
const TokenModel = require('../models/token-model');
const AuthenticationError = require('../../libs/errors/auth/authentication-error');
const AuthorizationError = require('../../libs/errors/auth/authorization-error');
const ResourceExistxError = require('../../libs/errors/validation/resource-exists-error');
const TokenExpiredError = require('../../libs/errors/token-expired-error');

const controller = {};

controller.login = async (ctx) => {
  const {
    email,
    password
  } = ctx.request.body;

  try {
    const user = await UserModel.getUser(email, password);
    const { accessToken } = await TokenModel.findOne({ user: user._id });

    ctx.body = { accessToken };

    ctx.status = 200;
  } catch (err) {
    console.log(`Error on login: ${err}`);

    throw new AuthenticationError();
  }
};

controller.register = async (ctx) => {
  const reqData = ctx.request.body;

  console.log(`Registering user ${reqData.email}`);

  if (await UserModel.emailExists(reqData.email)) {
    throw new ResourceExistxError(`E-mail ${reqData.email} already exists`, 'email');
  }

  const user = await UserModel.createUser(reqData);
  const accessToken = await TokenModel.generateAccessToken(user, reqData.userId);

  await TokenModel.saveToken({
    accessToken,
  }, user);

  console.log(`User registered ${user.email}`);

  ctx.status = 200;
  ctx.body = {
    user,
    accessToken: accessToken,
  };
};

controller.authenticate = async (ctx) => {
  const request = new Request({
    headers: {
      ...ctx.request.headers,
      'content-type': 'application/x-www-form-urlencoded',
    },
    query: ctx.request.query,
    body: ctx.request.body,
    method: ctx.request.method,
  });

  try {
    const token = await authServer.authenticate(request, oauth2.initResponse(ctx));
    await TokenModel.verifyToken(token.accessToken);

    ctx.body = token.user;
    ctx.status = 200;
  } catch (err) {
    console.log(`Error on authenticate: ${err.message}`);

    if (err.inner instanceof TokenExpiredError) {
      throw err.inner;
    }

    throw new AuthorizationError();
  }
};

module.exports = controller;
