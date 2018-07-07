const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RATES = ["private", "joiner"];
const STATUS = ["requested", "approved", "paid", "completed"];

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
  customers: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
      },
      rate: {
        type: String,
        enum: RATES
      },
      status: {
        type: String,
        enum: STATUS
      },
      requested: {
        type: Date,
        default: Date.now
      }
    }
  ],
  accomodation: [
    {
      type: Schema.Types.ObjectId,
      ref: "Accomodation"
    }
  ],
  transportation: [
    {
      type: Schema.Types.ObjectId,
      ref: "TransportationByLand"
    }
  ],
  activities: [
    {
      type: Schema.Types.ObjectId,
      ref: "Activity"
    }
  ],
  activists: [
    {
      id: { type: Schema.Types.ObjectId, ref: "Activity" },
      guide: { type: Schema.Types.ObjectId, ref: "User" },
      customers: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
      date: Date
    }
  ],
  riders: [
    {
      id: { type: Schema.Types.ObjectId, ref: "TransportationByLand" },
      customers: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
      pickup: String,
      dropoff: String,
      date: Date
    }
  ],
  guests: [
    {
      accomodation: { type: Schema.Types.ObjectId, ref: "Accomodation" },
      room: { type: Schema.Types.ObjectId },
      customer: { type: Schema.Types.ObjectId, ref: "Customer" },
      startDate: Date,
      endDate: Date
    }
  ]
});

mongoose.model("Package", PackageSchema);
