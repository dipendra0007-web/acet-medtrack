const User = require('../models/User');
const Order = require('../models/Order');
const { logEvent } = require('../utils/logger');
const { sendNotification } = require('../utils/notifier');

// @desc    Get driver dashboard data
// @route   GET /api/driver/dashboard
// @access  Private (Driver)
const getDriverDashboard = async (req, res) => {
  try {
    const driver = await User.findById(req.user.id);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Fetch orders assigned to this driver
    const allOrders = await Order.find({ driverId: req.user.id });
    const activeOrders = allOrders.filter(o => o.status === 'Out for Delivery' || o.status === 'Driver Reached');
    const deliveredOrders = allOrders.filter(o => o.status === 'Delivered');

    res.json({
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        photo: driver.photo,
        driverDetails: driver.driverDetails
      },
      stats: {
        totalDeliveries: allOrders.length,
        activeDeliveries: activeOrders.length,
        completedDeliveries: deliveredOrders.length
      },
      activeOrders,
      deliveryHistory: deliveredOrders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    });
  } catch (error) {
    console.error('Driver dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update driver online/offline status
// @route   PUT /api/driver/status
// @access  Private (Driver)
const updateDriverStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['active', 'inactive', 'on_delivery'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be: active, inactive, or on_delivery' });
  }

  try {
    const driver = await User.findById(req.user.id);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $set: { 'driverDetails.status': status }
    });

    await logEvent('DRIVER_STATUS', req.user.id, req.user.name, 'driver', `Driver status updated to: ${status}`);

    res.json({ message: `Status updated to ${status}`, status });
  } catch (error) {
    console.error('Update driver status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update driver GPS location
// @route   PUT /api/driver/location
// @access  Private (Driver)
const updateDriverLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        'driverDetails.currentLocation.latitude': latitude,
        'driverDetails.currentLocation.longitude': longitude
      }
    });

    res.json({ message: 'Location updated', latitude, longitude });
  } catch (error) {
    console.error('Update driver location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all approved active drivers (for admin dispatch)
// @route   GET /api/driver/available
// @access  Private (Admin)
const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver', 'driverDetails.approved': true });
    const cleanedDrivers = drivers.map(d => {
      const doc = typeof d.toObject === 'function' ? d.toObject() : { ...d };
      return {
        id: doc._id,
        name: doc.name,
        email: doc.email,
        driverDetails: {
          vehicleName: doc.driverDetails?.vehicleName,
          vehicleNumber: doc.driverDetails?.vehicleNumber,
          licenseNumber: doc.driverDetails?.licenseNumber,
          status: doc.driverDetails?.status,
          currentLocation: doc.driverDetails?.currentLocation
        }
      };
    });
    res.json(cleanedDrivers);
  } catch (error) {
    console.error('Get available drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update status of assigned order
// @route   PUT /api/driver/orders/:id/status
// @access  Private (Driver)
const updateAssignedOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.driverId !== req.user.id) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }

    const setPayload = { status };
    if (status === 'Driver Reached') {
      await sendNotification(
        order.patientId,
        'Driver Reached Your Location! 🛵📍',
        `Driver ${order.driverName} has arrived at your location. Please receive your order!`,
        'order_reached'
      );
      await sendNotification('admin', 'Driver Arrived at Location 📍', `Driver ${order.driverName} has reached patient ${order.patientName}'s location.`, 'order_reached');
    } else if (status === 'Delivered') {
      await User.findByIdAndUpdate(req.user.id, { $set: { 'driverDetails.status': 'active' } });
      await sendNotification(order.patientId, 'Order Delivered! 🎉', `Your medicine order has been successfully delivered by ${order.driverName}. Thank you for choosing MedTrack!`, 'order_dispatch');
      await sendNotification('admin', 'Order Completed ✅', `Order ${order._id.substring(0, 8)}... has been successfully delivered to patient ${order.patientName}.`, 'order_dispatch');
    }

    const updated = await Order.findByIdAndUpdate(id, { $set: setPayload }, { new: true });
    await logEvent('ORDER_STATUS_UPDATED', req.user.id, req.user.name, req.user.role, `Driver updated order ${order._id} status to ${status}`);
    res.json(updated);
  } catch (error) {
    console.error('Driver order status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDriverDashboard,
  updateDriverStatus,
  updateDriverLocation,
  getAvailableDrivers,
  updateAssignedOrderStatus
};
