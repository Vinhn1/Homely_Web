import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function verifyAdmin() {
    try {
        console.log('--- Homely Admin Verification ---');
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');
        console.log('Database Name:', mongoose.connection.name);

        const adminUsername = 'admin';
        const adminEmail = 'admin@homely.com';
        const adminPassword = 'Admin@1';

        // 1. Xóa sạch dấu vết cũ (nếu có lỗi logic ở các lần trước)
        console.log(`Cleaning up existing accounts for "${adminUsername}" or "${adminEmail}"...`);
        await User.deleteMany({ 
            $or: [{ username: adminUsername }, { email: adminEmail }] 
        });

        // 2. Tạo mới hoàn toàn
        console.log('Creating fresh Admin account...');
        const newAdmin = new User({
            username: adminUsername,
            email: adminEmail,
            hashedPassword: adminPassword, // Sẽ được băm bởi hook pre('save')
            displayName: 'System Admin',
            role: 'admin'
        });

        await newAdmin.save();
        console.log('✅ Admin account created successfully!');

        // 3. Kiểm tra lại lần cuối
        const verifiedUser = await User.findOne({ username: adminUsername });
        if (verifiedUser) {
            console.log('VERIFICATION SUCCESSFUL:');
            console.log(' - ID:', verifiedUser._id);
            console.log(' - Username:', verifiedUser.username);
            console.log(' - Role:', verifiedUser.role);
        } else {
            console.log('❌ VERIFICATION FAILED: User not found after save.');
        }

        process.exit(0);
    } catch (err) {
        console.error('CRITICAL ERROR:', err);
        process.exit(1);
    }
}

verifyAdmin();
