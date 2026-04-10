import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: 'backend/.env' });

const testAccounts = [
    {
        username: 'vinh_landlord',
        email: 'vinh_landlord@homely.com',
        hashedPassword: 'Password@123', // Will be hashed by pre-save hook
        role: 'owner',
        displayName: 'Chủ Nhà Test',
    },
    {
        username: 'vinh_tenant',
        email: 'vinh_tenant@homely.com',
        hashedPassword: 'Password@123', // Will be hashed by pre-save hook
        role: 'user',
        displayName: 'Người Thuê Test',
    }
];

const createAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        for (const account of testAccounts) {
            // Check if user exists
            const existingUser = await User.findOne({ email: account.email });
            if (existingUser) {
                console.log(`User ${account.email} already exists. Updating...`);
                // If we want to reset password, we need to handle it carefully because of pre-save
                existingUser.username = account.username;
                existingUser.role = account.role;
                existingUser.displayName = account.displayName;
                existingUser.hashedPassword = account.hashedPassword; // This will trigger pre-save hash
                await existingUser.save();
            } else {
                await User.create(account);
                console.log(`Created user: ${account.email}`);
            }
        }

        console.log('Test accounts created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test accounts:', error);
        process.exit(1);
    }
};

createAccounts();
