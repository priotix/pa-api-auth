const Router = require('koa-router');
const oauthCtrl = require('../controllers/oauth-controller');
const oauthSchema = require('../validations/oauth-schema');
const validate = require('../../libs/validate');

const oauthRouter = new Router();

// login
oauthRouter.post(
  '/oauth/login',
  validate(oauthSchema.login),
  oauthCtrl.login,
);

// register
oauthRouter.post(
  '/oauth/register',
  validate(oauthSchema.register),
  oauthCtrl.register,
);

// authenticate
oauthRouter.get(
  '/oauth/authenticate',
  validate(oauthSchema.authenticate),
  oauthCtrl.authenticate,
);

module.exports = oauthRouter;
