import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/property.model';

dotenv.config();

const filePath = path.join(__dirname, '../../data/properties.csv');

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected...');
    importCSV();
  })
  .catch(err => console.error('❌ DB Connection error:', err));

const importCSV = () => {
  const properties: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      const property = {
        title: row.title,
        type: row.type,
        price: Number(row.price),
        state: row.state,
        city: row.city,
        areaSqFt: Number(row.areaSqFt),
        bedrooms: Number(row.bedrooms),
        bathrooms: Number(row.bathrooms),
        amenities: typeof row.amenities === 'string'
        ? row.amenities.split('|').map((a: string) => a.trim())
        : [],
        furnished: row.furnished,
        availableFrom: row.availableFrom,
        listedBy: row.listedBy,
        tags: typeof row.tags === 'string'
        ? row.tags.split('|').map((t: string) => t.trim())
        : [],
        colorTheme: row.colorTheme,
        rating: parseFloat(row.rating),
        isVerified: row.isVerified?.toLowerCase() === 'true',
        listingType: row.listingType,
        createdBy: '68388770db0a33c26fe1dc32'  // will be updated after user system
      };
      properties.push(property);
    })
    .on('end', async () => {
      try {
        await Property.insertMany(properties);
        console.log(`📥 Imported ${properties.length} properties into MongoDB`);
        process.exit(0);

      } catch (err) {
        console.error('❌ Import failed:', err);
        process.exit(1);
      }
    });
};
