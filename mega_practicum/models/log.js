
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    courseId: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    text: { type: String, required: true }
});

const Log = mongoose.model('Log', LogSchema);
module.exports = Log;