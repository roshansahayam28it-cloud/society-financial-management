import Maintenance from '../models/Maintenance.js';

// @desc    Generate a new maintenance bill
// @route   POST /api/maintenance
// @access  Private/Admin
const generateMaintenanceBill = async (req, res, next) => {
  try {
    const { user, month, year, amount } = req.body;

    const maintenance = await Maintenance.create({
      user,
      month,
      year,
      amount,
    });

    if (maintenance) {
      res.status(201).json(maintenance);
    } else {
      res.status(400);
      throw new Error('Invalid data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's maintenance bills
// @route   GET /api/maintenance/mybills
// @access  Private
const getMyMaintenance = async (req, res, next) => {
  try {
    const bills = await Maintenance.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all maintenance bills
// @route   GET /api/maintenance
// @access  Private/Admin
const getAllMaintenance = async (req, res, next) => {
  try {
    const bills = await Maintenance.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance status
// @route   PUT /api/maintenance/:id/pay
// @access  Private/Admin
const updateMaintenanceStatus = async (req, res, next) => {
  try {
    const bill = await Maintenance.findById(req.params.id);

    if (bill) {
      bill.status = req.body.status || 'Paid';
      if (bill.status === 'Paid') {
          bill.paidAt = Date.now();
      }
      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404);
      throw new Error('Bill not found');
    }
  } catch (error) {
    next(error);
  }
};

export { generateMaintenanceBill, getMyMaintenance, getAllMaintenance, updateMaintenanceStatus };
