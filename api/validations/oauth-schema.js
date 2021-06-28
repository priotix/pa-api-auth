const Joi = require('joi');
const config = require('config');

const schemes = {};

schemes.register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(new RegExp(config.get('auth.passwordRegExp')), 'valid password').required(),
    userId: Joi.string().required(),
  }),
};

schemes.login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

schemes.authenticate = {
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(),
};

module.exports = schemes;
