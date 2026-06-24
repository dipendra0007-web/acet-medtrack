const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicineReminder = require('../models/MedicineReminder');
const SystemLog = require('../models/SystemLog');
const ShopItem = require('../models/ShopItem');
const Order = require('../models/Order');
const { logEvent } = require('../utils/logger');
const { sendNotification } = require('../utils/notifier');


// @desc    Get admin analytics and summary
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments({});
    const activeReminders = await MedicineReminder.countDocuments({ active: true });
    
    // Recent activity log (last 20 logs)
    const logs = await SystemLog.find({});
    // Simple sort by timestamp descending
    const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);

    // Count pending doctor approvals
    const pendingDoctors = await User.countDocuments({ role: 'doctor', doctorApproved: false });

    res.json({
      stats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalAppointments,
        activeReminders,
        pendingDoctors
      },
      recentLogs: sortedLogs
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // Strip passwords before sending
    const cleanedUsers = users.map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
    res.json(cleanedUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own administrator account' });
    }

    await User.deleteOne({ _id: userId });

    await logEvent(
      'DELETE_USER',
      req.user.id,
      req.user.name,
      req.user.role,
      `Deleted user: ${user.name} (${user.email}) - Role: ${user.role}`
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve/Reject a doctor registration
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin)
const approveDoctor = async (req, res) => {
  const doctorId = req.params.id;
  const { approved } = req.body; // boolean

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (approved) {
      await User.findByIdAndUpdate(doctorId, { $set: { doctorApproved: true } });
      await logEvent(
        'APPROVE_DOCTOR',
        req.user.id,
        req.user.name,
        req.user.role,
        `Approved doctor registration: Dr. ${doctor.name}`
      );
      await sendNotification(
        doctorId,
        'Account Approved 🎓',
        `Congratulations! Your doctor profile registration has been approved. You can now access the Doctor Panel.`,
        'approval'
      );
      await sendNotification(
        'admin',
        'Doctor Approved',
        `Dr. ${doctor.name} has been approved and added to the medical registry.`,
        'approval'
      );
      res.json({ message: `Doctor ${doctor.name} has been approved successfully` });
    } else {
      // Rejecting means deleting the pending registration record
      await User.deleteOne({ _id: doctorId });
      await logEvent(
        'REJECT_DOCTOR',
        req.user.id,
        req.user.name,
        req.user.role,
        `Rejected and deleted doctor registration: Dr. ${doctor.name}`
      );
      res.json({ message: `Doctor ${doctor.name}'s registration has been rejected and removed` });
    }
  } catch (error) {
    console.error('Approve doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all audit logs
// @route   GET /api/admin/logs
// @access  Private (Admin)
const getSystemLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find({});
    const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(sortedLogs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Shop Management Admin Endpoints
const createShopItem = async (req, res) => {
  const { name, description, priceINR, priceUSD, stocks, photo, category } = req.body;
  if (!name || !description || !priceINR || !priceUSD || !photo || !category) {
    return res.status(400).json({ message: 'All shop item fields are required.' });
  }
  try {
    const item = await ShopItem.create({
      name,
      description,
      priceINR: Number(priceINR),
      priceUSD: Number(priceUSD),
      stocks: Number(stocks || 0),
      photo,
      category
    });
    await logEvent('SHOP_ITEM_CREATED', req.user.id, req.user.name, req.user.role, `Created shop item: ${name}`);
    res.status(201).json(item);
  } catch (error) {
    console.error('Create shop item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateShopItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, priceINR, priceUSD, stocks, photo, category } = req.body;
  try {
    const item = await ShopItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Shop item not found' });
    }
    const updated = await ShopItem.findByIdAndUpdate(id, {
      $set: {
        name,
        description,
        priceINR: Number(priceINR),
        priceUSD: Number(priceUSD),
        stocks: Number(stocks || 0),
        photo,
        category
      }
    }, { new: true });
    await logEvent('SHOP_ITEM_UPDATED', req.user.id, req.user.name, req.user.role, `Updated shop item: ${name}`);
    res.json(updated);
  } catch (error) {
    console.error('Update shop item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteShopItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await ShopItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Shop item not found' });
    }
    await ShopItem.deleteOne({ _id: id });
    await logEvent('SHOP_ITEM_DELETED', req.user.id, req.user.name, req.user.role, `Deleted shop item: ${item.name}`);
    res.json({ message: 'Shop item deleted successfully' });
  } catch (error) {
    console.error('Delete shop item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Order Management Admin Endpoints
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    // Sort by createdAt descending
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedOrders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, driverName, driverPhone, deliveryStreet, deliveryFloor, deliveryArea, deliveryLandmark } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const setPayload = { status };
    if (status === 'Out for Delivery') {
      if (!driverName || !driverPhone) {
        return res.status(400).json({ message: 'Driver Name and Phone are required when Out for Delivery.' });
      }
      setPayload.driverName = driverName;
      setPayload.driverPhone = driverPhone;
      setPayload.deliveryStreet = deliveryStreet || '';
      setPayload.deliveryFloor = deliveryFloor || '';
      setPayload.deliveryArea = deliveryArea || '';
      setPayload.deliveryLandmark = deliveryLandmark || '';

      // Notify the patient
      await sendNotification(
        order.patientId,
        'Delivery Boy Assigned 🛵',
        `Driver ${driverName} (${driverPhone}) has been assigned to dispatch your order. Destination: Floor: ${deliveryFloor || '-'}, Street: ${deliveryStreet || '-'}, Area: ${deliveryArea || '-'}, Landmark: ${deliveryLandmark || '-'}.`,
        'order_dispatch'
      );

      // Notify admins
      await sendNotification(
        'admin',
        'Order Dispatched 📦',
        `Order ${order._id.substring(0, 8)}... has been assigned to driver ${driverName} (${driverPhone}).`,
        'order_dispatch'
      );
    } else if (status === 'Delivered') {
      // Notify the patient
      await sendNotification(
        order.patientId,
        'Order Delivered! 🎉',
        `Your medicine order has been successfully delivered by ${order.driverName || 'driver'}. Thank you for choosing MedTrack!`,
        'order_dispatch'
      );

      // Notify admins
      await sendNotification(
        'admin',
        'Order Completed ✅',
        `Order ${order._id.substring(0, 8)}... has been successfully delivered to patient ${order.patientName}.`,
        'order_dispatch'
      );
    }

    const updated = await Order.findByIdAndUpdate(id, {
      $set: setPayload
    }, { new: true });

    await logEvent(
      'ORDER_STATUS_UPDATED',
      req.user.id,
      req.user.name,
      req.user.role,
      `Updated order ${order._id} status to ${status}`
    );
    res.json(updated);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const factoryReset = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const useMongo = require('../models/dbModel').getUseMongo();
    
    const dataDir = path.join(__dirname, '../data');
    const backupDir = path.join(__dirname, '../data_backup');
    
    if (!fs.existsSync(backupDir)) {
      return res.status(400).json({ message: 'Backup files not found. Cannot reset.' });
    }
    
    // 1. Reset Local File storage (JSON)
    const files = fs.readdirSync(backupDir);
    files.forEach(file => {
      fs.copyFileSync(path.join(backupDir, file), path.join(dataDir, file));
    });
    
    // 2. If using MongoDB, clear all models and import from JSON files
    if (useMongo) {
      const mongoose = require('mongoose');
      const models = mongoose.modelNames();
      for (const modelName of models) {
        try {
          const model = mongoose.model(modelName);
          await model.deleteMany({});
          
          const collectionName = modelName.toLowerCase() + 's';
          const filePath = path.join(backupDir, `${collectionName}.json`);
          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent || '[]');
            if (data.length > 0) {
              await model.insertMany(data);
            }
          }
        } catch (e) {
          console.error(`Error resetting mongo model ${modelName}:`, e);
        }
      }
    }
    
    await logEvent(
      'FACTORY_RESET',
      req.user.id,
      req.user.name,
      req.user.role,
      'Triggered factory reset to clean default demo data'
    );
    
    res.json({ message: 'Database reset successfully to default seed data.' });
  } catch (error) {
    console.error('Factory reset error:', error);
    res.status(500).json({ message: 'Failed to reset database: ' + error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  approveDoctor,
  getSystemLogs,
  createShopItem,
  updateShopItem,
  deleteShopItem,
  getAllOrders,
  updateOrderStatus,
  factoryReset
};
