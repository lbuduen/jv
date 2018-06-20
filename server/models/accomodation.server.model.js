const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ACCOMODATION_TYPE = ['hotel', 'motel', 'hostel', 'campsite', 'inn', 'guest house', 'other'];

const ROOM_TYPE = ['single', 'double', 'triple', 'quad', 'queen', 'king', 'studio', 'suite', 'apartment', 'cabana', 'villa', 'other'];

const AMENITIES = ['pool', 'gym', 'spa', ''];

const RoomSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ROOM_TYPE
    },
    beds: {
        type: Number,
        default: 1
    },
    available: {
        type: Boolean,
        default: true
    },
    description: String,
    observations: String,
    photos: [String]
});

const AccomodationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ACCOMODATION_TYPE
    },
    contact: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    latitude: String,
    longitude: String,
    phone: [String],
    rooms: {
        type: [RoomSchema],
    },
    amenities: {
        type: [String],
        enum: AMENITIES
    },
    active: {
        type: Boolean,
        default: true
    },
    description: String,
    photos: [String],
    webpage: String,
    observations: String
});

mongoose.model('Accomodation', AccomodationSchema);