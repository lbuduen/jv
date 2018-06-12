const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccomodationTypeSchema = new Schema({
    type: String
});

const AccomodationAmenitySchema = new Schema({
    name: String
});

const RoomSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    photos: [String]
});

const AccomodationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: AccomodationTypeSchema,
        required: true
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
    amenities: [AccomodationAmenitySchema],
    rating: { type: Number, min: 1, max: 5 },
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