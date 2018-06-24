const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    quota: Number,
    photos: [String],
    startDate: Date,
    endDate: Date,
    joinerRate: Number,
    privateRate: Number,
    activities: [{
        id: { type: Schema.Types.ObjectId, ref: 'Activity' },
        guide: { type: Schema.Types.ObjectId, ref: 'User' },
        customers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        date: Date
    }],
    transportation: [{
        id: { type: Schema.Types.ObjectId, ref: 'TransportationByLand' },
        customers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        date: Date
    }],
    accomodation: [{
        id: { type: Schema.Types.ObjectId, ref: 'Accomodation' },
        customers: { type: Schema.Types.ObjectId, ref: 'User' },
        startDate: Date,
        endDate: Date
    }],
});

mongoose.model('Package', PackageSchema);