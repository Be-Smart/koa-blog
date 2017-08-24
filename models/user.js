const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: 'User name must be provided',
  },
  email: {
    type: String,
    unique: true,
    required: 'Email is required',
    validate: [{
      validator(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      msg: 'Please enter a correct email',
    }],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: 'Password must be provided',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('user', userSchema);
