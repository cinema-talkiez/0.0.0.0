const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    tokenVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // TTL index: 24 hrs
  },
  { collection: 'users' } // Explicitly set collection name
);

module.exports = mongoose.model('User', userSchema);
