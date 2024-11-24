const mongoose = require('mongoose');

// Define the Student schema
const courseSchema = new mongoose.Schema({
    uvuId: { type: String, required: true },
    courses: { type: String, required: true },

});

// Create the Student model
const CourseModel = mongoose.model('Student', courseSchema);

module.exports = CourseModel;