import express from 'express';
import {
  generateMaintenanceBill,
  getMyMaintenance,
  getAllMaintenance,
  updateMaintenanceStatus,
} from '../controllers/maintenanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, generateMaintenanceBill).get(protect, admin, getAllMaintenance);
router.route('/mybills').get(protect, getMyMaintenance);
router.route('/:id/pay').put(protect, admin, updateMaintenanceStatus);

export default router;
