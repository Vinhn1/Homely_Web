import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function createAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');

        const adminData = {
            username: 'admin',
            email: 'admin@homely.com',
            hashedPassword: 'Admin@1', // Sẽ được băm bởi hook pre('save')
            displayName: 'System Admin',
            role: 'admin'
        };

        // Kiểm tra xem đã tồn tại chưa
        const existingUser = await User.findOne({ 
            $or: [{ username: adminData.username }, { email: adminData.email }] 
        });

        if (existingUser) {
            console.log('User already exists. Updating role to admin...');
            existingUser.role = 'admin';
            await existingUser.save();
            console.log('User updated to Admin successfully!');
        } else {
            const newAdmin = new User(adminData);
            await newAdmin.save();
            console.log('New Admin account created successfully!');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();
