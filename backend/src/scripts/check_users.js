import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkUsers() {
    try {
        console.log('Connecting to MongoDB...');
        console.log('URL:', process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');
        console.log('Database Name:', mongoose.connection.name);

        const users = await User.find({}, 'username email role displayName');
        console.log('Total users found:', users.length);
        console.log('Users list:', JSON.stringify(users, null, 2));

        const adminUser = await User.findOne({ username: 'admin' });
        if (adminUser) {
            console.log('Admin user "admin" found! Account details:');
            console.log(' - Username:', adminUser.username);
            console.log(' - Email:', adminUser.email);
            console.log(' - Role:', adminUser.role);
            console.log(' - Display Name:', adminUser.displayName);
        } else {
            console.log('Admin user "admin" NOT found.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
}

checkUsers();
