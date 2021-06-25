const bcrypt = require('bcrypt');

module.exports = function passwordHasher(schema) {
  schema.add({
    created: Date,
    updated: Date,
  });

  schema.pre('save', async function preSave(next) {
    if ((this.isModified('password') || this.isNew) && this.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);

      this.password = hash;
    }

    await next();
  });
};
