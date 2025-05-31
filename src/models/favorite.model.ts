// models/favorite.model.ts
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, property: 1 }, { unique: true }); // prevent duplicates

export const Favorite = mongoose.model('Favorite', favoriteSchema);
