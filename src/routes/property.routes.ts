import express from 'express';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from '../controllers/property.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', verifyToken, createProperty);
router.put('/:id', verifyToken, updateProperty);
router.delete('/:id', verifyToken, deleteProperty);

export default router;
