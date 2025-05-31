// controllers/favorite.controller.ts
import { Request, Response } from 'express';
import { Favorite } from '../models/favorite.model';
import  Property from '../models/property.model';

// controllers/favorite.controller.ts
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { propertyId, propertyIds } = req.body;

    // Case 1: Add a single favorite
    if (propertyId) {
      const propertyExists = await Property.findById(propertyId);
      if (!propertyExists) return res.status(404).json({ error: 'Property not found' });

      const favorite = await Favorite.create({ user: userId, property: propertyId });
      return res.status(201).json(favorite);
    }

    // Case 2: Add multiple favorites
    if (Array.isArray(propertyIds)) {
      const validPropertyIds = await Property.find({
        _id: { $in: propertyIds }
      }).distinct('_id'); // get only valid IDs

      const insertData = validPropertyIds.map(pid => ({
        user: userId,
        property: pid,
      }));

      const favorites = await Favorite.insertMany(insertData, { ordered: false });
      return res.status(201).json({ added: favorites.length, favorites });
    }

    return res.status(400).json({ error: 'Invalid input. Provide propertyId or propertyIds.' });
  } catch (err: any) {
    if (err.code === 11000 || err.writeErrors) {
      return res.status(400).json({
        error: 'Some properties were already favorited',
        details: err.writeErrors?.map((e: any) => e.errmsg),
      });
    }
    res.status(500).json({ error: 'Could not add favorites' });
  }
};


export const getFavorites = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const favorites = await Favorite.find({ user: userId }).populate('property');
  res.json(favorites);
};

export const removeFavorite = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  const removed = await Favorite.findOneAndDelete({ user: userId, property: id });
  if (!removed) return res.status(404).json({ error: 'Favorite not found' });

  res.json({ message: 'Removed from favorites' });
};
