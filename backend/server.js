import app from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';


dotenv.config();
connectDB();



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})