const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    photos: [String]
});

mongoose.model('Activity', ActivitySchema);