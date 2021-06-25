const SingleError = require('../single-error');

module.exports = class ResourceExistsError extends SingleError {
  constructor(message, path) {
    // Calling parent constructor of base Error class.
    super(message, `${path}-exists`, path);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    this.statusCode = 409;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
};
