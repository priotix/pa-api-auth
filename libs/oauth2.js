const OAuth2Server = require('oauth2-server');
const model = require('../api/models');

const { Request, Response } = OAuth2Server;

const authServer = new OAuth2Server({
  model,
  debug: true,
});

const oauth2 = {};

oauth2.initResponse = (ctx) => new Response({
  headers: {
    ...ctx.response.headers,
  },
  body: ctx.response.body,
});

module.exports = {
  oauth2,
  authServer,
  Request,
  Response,
};
