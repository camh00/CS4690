const mongoose = require('mongoose');

// Define the Course schema
const courseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  display: { type: String, required: true }
});

// Create the Course model
const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;