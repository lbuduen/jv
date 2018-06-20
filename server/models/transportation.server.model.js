const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportationByLandSchema = new Schema({
    plate: {
        type: String,
        unique: true
    },
    capacity: Number,
    color: String,
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: String,
    model: String,
    photo: String,
    observations: String
});
mongoose.model('TransportationByLand', TransportationByLandSchema);

const TransportationByAirSchema = new Schema({
    company: String,
    flight: String,
    origin: String,
    destination: String,
    departure: Date,
    arrival: Date
});
mongoose.model('TransportationByAir', TransportationByAirSchema);