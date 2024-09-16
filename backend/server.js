
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import dotenv from 'dotenv';


dotenv.config();

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// إعداد مجلد 'profile-pics' كمجلد ثابت
app.use('/profile-pics', express.static('profile-pics'));


// DB config
connectDB().catch(err => console.error('Failed to connect to MongoDB', err));

// API endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/profile-pics', express.static('profile-pics')); 
app.use('/api/user', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

app.listen(port, () => console.log(`Server running on localhost:${port}`));