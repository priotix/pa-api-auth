const bluebird = require('bluebird');
const bcrypt = require('bcrypt');
const Mongoose = bluebird.promisifyAll(require('mongoose'));
const changeRecorder = require('./plugins/change-recorder');
const passwordHasher = require('./plugins/password-hasher');
const NotFoundError = require('../../libs/errors/not-found-error');
const BadRequestError = require('../../libs/errors/bad-request-error');

const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
});

let UserModel;
let TokenModel;

// enable tracking for create/update dates
UserSchema.plugin(changeRecorder);

// enable password hasher
UserSchema.plugin(passwordHasher);

// never include sensitive information in JSON output
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    const {
      __v,
      _id,
      password,
      ...trans
    } = ret;

    return trans;
  },
});

UserSchema.statics.emailExists = async function emailExists(email) {
  const count = await UserModel.count({ email });
  return count > 0;
};

UserSchema.statics.getUser = async function getUser(email, password) {
  console.log(`Getting user email: ${email}`);
  const user = await this.findOne({ email });
  if (!user) {
    throw new NotFoundError('User not found', 'user');
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    throw new BadRequestError('Invalid password', 'password');
  }

  return user;
};

UserSchema.statics.createUser = async function createUser(userData) {
  const user = new UserModel(userData);
  await user.save();

  return user;
};

UserModel = Mongoose.model('User', UserSchema);

module.exports = UserModel;

TokenModel = require('./token-model');
