import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
const app = express();

dotenv.config();
connectDB();

app.get('/', (res, req) => {
    res.send('Server Homely đang chạy!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})