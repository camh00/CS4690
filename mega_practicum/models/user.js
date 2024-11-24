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

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;