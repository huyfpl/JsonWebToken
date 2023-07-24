const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouter = require('./router/auth');
const userRouter = require('./router/user');
dotenv.config();// sài .env
const app = express();
app.use(cors());
app.use(cookieParser());// tạo cookie 
app.use(express.json());
// Connect to MongoDB

(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  })();

// Routes 
app.use('/v1/auth',authRouter);
app.use('/v1/user',userRouter);
app.listen(3000, () => console.log('Server is running on port 3000'));
