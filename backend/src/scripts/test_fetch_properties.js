import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Property from '../models/Property.js';
import Category from '../models/Category.js';
import Amenity from '../models/Amenity.js';
import District from '../models/District.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testFetch() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');

        let query = { listingStatus: 'active' };
        
        console.log('Running query:', JSON.stringify(query));
        
        const properties = await Property.find(query)
            .populate("owner", "displayName avatarUrl phone")
            .populate("category", "name icon")
            .populate("amenities", "name icon")
            .populate("location.district", "name city")
            .sort({ isPromoted: -1, createdAt: -1 });

        console.log('Results found:', properties.length);
        if (properties.length > 0) {
            console.log('First property title:', properties[0].title);
            console.log('First property location:', JSON.stringify(properties[0].location));
        }

        process.exit(0);
    } catch (err) {
        console.error('--- CRITICAL ERROR ---');
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        process.exit(1);
    }
}

testFetch();
