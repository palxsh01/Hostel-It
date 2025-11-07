import mongoose from 'mongoose';

const { Schema } = mongoose;

const GeoPointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  { _id: false }
);

const LocationSchema = new Schema(
  {
    address: { type: String },
    geo: { type: GeoPointSchema, required: true }
  },
  { _id: false }
);

const OrderItemSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    customerId: { type: String, required: true },
    pickup: { type: LocationSchema, required: true },
    dropoff: { type: LocationSchema, required: true },
    items: { type: [OrderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'wallet'], required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'picked_up', 'delivered', 'cancelled'],
      default: 'pending'
    },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver', default: null },
    declinedBy: { type: [mongoose.Types.ObjectId], ref: 'Driver', default: [] }
  },
  { timestamps: true }
);

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'pickup.geo': '2dsphere' });

const Order = mongoose.model('Order', OrderSchema);

export default Order;

