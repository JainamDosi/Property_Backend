import { Request, Response } from 'express';
import Property from '../models/property.model';
import { buildPropertyFilter } from '../utils/buildPropertyFilter';


// ✅ CREATE
import redis from '../config/redis';
// ...existing code...

// ✅ CREATE
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const newProperty = new Property({
      ...req.body,
      createdBy: user._id  
    });

    const saved = await newProperty.save();
    // Invalidate all properties cache
    await redis.del('properties:all');
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// ✅ GET ALL (with optional filters later)
export const getAllProperties = async (req: Request, res: Response):Promise<void> => {
  try {
    // Remove all keys from Redis (use with caution!)
    const filter = buildPropertyFilter(req.query);
    const cacheKey = `properties:all`;
    const cached = await redis.get(cacheKey);
    console.log("HRLLO")
    if (cached) {
      res.json(JSON.parse(cached));
      
      console.log('Cache hit:', cacheKey);
      return;
    }
    const properties = await Property.find(filter);
    await redis.set(cacheKey, JSON.stringify(properties), 'EX', 3600);
    
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// ✅ GET BY ID
export const getPropertyById = async (req: Request, res: Response):Promise<void> => {
  try {
    const cacheKey = `property:${req.params.id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    await redis.set(cacheKey, JSON.stringify(property), 'EX', 3600);
    console.log('Cache miss:', cacheKey);
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

// ✅ UPDATE (Only by creator)
export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    if (req.params.id) {
      const property = await Property.findById(req.params.id);
      if (!property) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      if (property.createdBy.toString() !== user.id) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }
      const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
      // Invalidate cache for this property and all properties
      await redis.del(`property:${req.params.id}`);
      await redis.del('properties:all');
      res.json(updated);
      return;
    }

    const filter = buildPropertyFilter(req.query);
    filter.createdBy = user.id;
    const result = await Property.updateMany(filter, req.body);
    // Invalidate all properties cache
    await redis.del('properties:all');
    res.json({ message: `Updated ${result.modifiedCount} properties.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update property/properties' });
  }
};

// ✅ DELETE (Only by creator)
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    if (req.params.id) {
      const property = await Property.findById(req.params.id);
      if (!property) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      if (property.createdBy.toString() !== user.id) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }
      await property.deleteOne();
      // Invalidate cache for this property and all properties
      await redis.del(`property:${req.params.id}`);
      await redis.del('properties:all');
      res.json({ message: 'Deleted successfully' });
      return;
    }

    const filter = buildPropertyFilter(req.query);
    filter.createdBy = user.id;
    const result = await Property.deleteMany(filter);
    // Invalidate all properties cache
    await redis.del('properties:all');
    res.json({ message: `Deleted ${result.deletedCount} properties.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete property/properties' });
  }
};