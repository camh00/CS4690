// Filename - model/User.js

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const passportLocalMongoose = require('passport-local-mongoose');
// var User = new Schema({
//     id : mongoose.Schema.ObjectId,
//     username: {
//         type: String
//     },
//     password: {
//         type: String
//     }
// })

// User.plugin(passportLocalMongoose);

// module.exports = mongoose.model('users', User)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  school: { type: String, required: true },
  role: { type: Number, required: true } // 1 for admin, 2 for teacher, 3 for student
});

UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;