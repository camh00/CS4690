const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const iaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    uvuId: {
        type: String,
        required: true
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const ia = mongoose.model('IA', iaSchema);

module.exports = ia;