import { Router } from 'express';
import Order from '../models/Order.js';
import Driver from '../models/Driver.js';

const router = Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      pickup,
      dropoff,
      items = [],
      totalAmount,
      paymentMethod
    } = req.body || {};

    if (!customerId || !pickup?.geo?.coordinates || !dropoff?.geo?.coordinates || !paymentMethod || totalAmount == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = await Order.create({
      customerId,
      pickup,
      dropoff,
      items,
      totalAmount,
      paymentMethod
    });

    // Fire-and-forget: identify nearby drivers (for frontend to notify)
    // We return nearby drivers so the frontend can optionally notify via its own channel.
    const maxDistanceMeters = Number(req.query.maxDistance ?? 5000);
    const nearbyDrivers = await Driver.find({
      isAvailable: true,
      location: {
        $near: {
          $geometry: pickup.geo,
          $maxDistance: maxDistanceMeters
        }
      }
    })
      .limit(20)
      .select('_id name phone vehicle location');

    return res.status(201).json({ order, nearbyDrivers });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// Get order by id
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid order id' });
  }
});

// Get order history for a customer
router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) return res.status(400).json({ error: 'customerId is required' });
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 }).limit(200);
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (e.g., picked_up, delivered, cancelled)
router.post('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body || {};
    const allowed = ['picked_up', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;

