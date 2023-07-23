


// server.js


const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();



mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);



// Secure task management routes using middleware
const jwt = require('jsonwebtoken');
const secureRoute = express.Router();
secureRoute.use((req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Definining API routes for task management
const taskRouter = require('../tracker-jet/src/routes/tasks');
app.use('/api/tasks', secureRoute, taskRouter);



// Definining API routes for user authentication
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);


// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});
