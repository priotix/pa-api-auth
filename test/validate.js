const chai = require('chai');

chai.use(require('chai-as-promised'));

const { expect } = chai;

const Joi = require('joi');

const getInputValidator = require('../libs/validate');
const MultiValidateError = require('../libs/errors/validation/multi-validate-error');

describe('libs/validate.js getImputVaildator tests', () => {
  describe('', () => {
    it('return function', () => {
      const inputValidator = getInputValidator();
      expect(inputValidator).to.be.a('function');
    });
    it('return a function which failed to validate', async () => {
      const ctx = {
        request: {
          body: {},
        },
      };
      const login = {
        body: Joi.object().keys({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      };
      const inputValidator = getInputValidator(login);
      await expect(inputValidator(ctx)).to.be.rejected;
    });
    it('return a function which validates simple schema', async () => {
      const ctx = {
        request: {
          body: {
            email: 'some@email.dom',
            password: '123456789',
          },
        },
      };
      const login = {
        body: Joi.object().keys({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      };
      const inputValidator = getInputValidator(login);
      expect(await inputValidator(ctx, async () => true)).to.be.a.true;
    });
  });
});