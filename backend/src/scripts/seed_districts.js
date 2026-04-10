import mongoose from 'mongoose';
import dotenv from 'dotenv';
import District from '../models/District.js';

dotenv.config({ path: 'backend/.env' });

const districts = [
    { name: 'Quận 1', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Quận 3', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Quận 7', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Quận 10', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Bình Thạnh', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Phú Nhuận', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Gò Vấp', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Tân Bình', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Thủ Đức', city: 'Hồ Chí Minh', isActive: true },
    { name: 'Huyện Bình Chánh', city: 'Hồ Chí Minh', isActive: true },
];

const seedDistricts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        for (const district of districts) {
            await District.findOneAndUpdate(
                { name: district.name, city: district.city },
                district,
                { upsert: true, new: true }
            );
        }

        console.log('Districts seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding districts:', error);
        process.exit(1);
    }
};

seedDistricts();
