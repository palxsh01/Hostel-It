import mongoose from 'mongoose';

const { Schema } = mongoose;

const GeoPointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      // [longitude, latitude]
      validate: v => Array.isArray(v) && v.length === 2
    }
  },
  { _id: false }
);

const DriverSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    vehicle: { type: String },
    isAvailable: { type: Boolean, default: true },
    location: { type: GeoPointSchema, index: '2dsphere', required: true },
    lastOnlineAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

DriverSchema.index({ location: '2dsphere' });

const Driver = mongoose.model('Driver', DriverSchema);

export default Driver;

