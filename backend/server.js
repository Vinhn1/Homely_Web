import { httpServer } from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';

dotenv.config();
connectDB();

const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server Homely started on port ${PORT}`);
    console.log(`⚡ Socket.IO ready`);
});