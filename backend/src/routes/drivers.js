import { Router } from 'express';
import Driver from '../models/Driver.js';
import Order from '../models/Order.js';

const router = Router();

// Upsert driver location and availability
router.post('/location', async (req, res) => {
  try {
    const { driverId, name, phone, vehicle, isAvailable = true, location } = req.body || {};
    if (!location?.coordinates) return res.status(400).json({ error: 'location.coordinates required' });

    const update = {
      name: name || 'Driver',
      phone,
      vehicle,
      isAvailable,
      location: { type: 'Point', coordinates: location.coordinates },
      lastOnlineAt: new Date()
    };

    const driver = await Driver.findOneAndUpdate(
      driverId ? { _id: driverId } : { phone },
      { $set: update },
      { new: true, upsert: true }
    );
    return res.json(driver);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update driver', details: err.message });
  }
});

// Fetch nearby pending orders for a driver
router.get('/:driverId/nearby-orders', async (req, res) => {
  try {
    const { driverId } = req.params;
    const maxDistance = Number(req.query.maxDistance ?? 5000);
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const orders = await Order.find({
      status: 'pending',
      declinedBy: { $ne: driver._id },
      'pickup.geo': {
        $near: {
          $geometry: driver.location,
          $maxDistance: maxDistance
        }
      }
    })
      .limit(30)
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch nearby orders' });
  }
});

// Driver accepts an order (with concurrency safety)
router.post('/:driverId/orders/:orderId/accept', async (req, res) => {
  try {
    const { driverId, orderId } = req.params;
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const updated = await Order.findOneAndUpdate(
      { _id: orderId, status: 'pending' },
      { $set: { status: 'accepted', driverId: driver._id } },
      { new: true }
    );

    if (!updated) return res.status(409).json({ error: 'Order already accepted or unavailable' });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to accept order' });
  }
});

// Driver rejects an order
router.post('/:driverId/orders/:orderId/reject', async (req, res) => {
  try {
    const { driverId, orderId } = req.params;
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const updated = await Order.findOneAndUpdate(
      { _id: orderId, status: 'pending' },
      { $addToSet: { declinedBy: driver._id } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Order not found or not pending' });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reject order' });
  }
});

export default router;

