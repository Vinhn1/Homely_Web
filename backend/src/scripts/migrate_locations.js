import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const PropertySchema = new mongoose.Schema({
    location: {
        coordinates: {
            lat: Number,
            lng: Number
        }
    }
}, { strict: false });

const Property = mongoose.model('Property', PropertySchema);

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');

        // Tìm các bản ghi có lat là null hoặc không tồn tại
        const result = await Property.updateMany(
            { 
                $or: [
                    { "location.coordinates.lat": null },
                    { "location.coordinates": { $exists: false } },
                    { "location.lat": { $exists: true } } // Di chuyển từ cấu trúc cũ sang mới nếu cần
                ] 
            },
            { 
                $set: { 
                    "location.coordinates": { lat: 10.2533, lng: 105.9722 } 
                } 
            }
        );

        console.log(`Successfully updated ${result.modifiedCount} properties!`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
