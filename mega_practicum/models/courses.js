const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

// Define the Course schema
const courseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  display: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }] // List of users
});

// Create the Course model
const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;