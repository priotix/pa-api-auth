module.exports = function changeRecorder(schema) {
  schema.add({
    created: Date,
    updated: Date,
  });

  schema.pre('save', function preSave(next) {
    const now = new Date();
    this.updated = now;
    if (!this.created) {
      this.created = now;
    }

    next();
  });

  schema.pre('update', function preUpdate(next) {
    const now = new Date();
    this.updated = now;
    if (!this.created) {
      this.created = now;
    }

    next();
  });

  schema.pre('findOneAndUpdate', (next) => {
    next();
  });

  schema.post('findOneAndUpdate', (doc, next) => {
    if (doc) {
      doc.save();
    }

    next();
  });
};
