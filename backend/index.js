require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Task Scheduler API is running');
});

// Debug route to test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Debug route to test register endpoint (temporary)
app.get('/debug/register', (req, res) => {
  res.json({ message: 'Register endpoint exists', method: 'GET' });
});

// Test route to verify auth routes are working
app.get('/debug/auth', (req, res) => {
  res.json({ 
    message: 'Auth routes are accessible',
    authRoutesLoaded: !!authRoutes,
    availableRoutes: ['/api/register', '/api/login']
  });
});

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

console.log('Auth routes loaded:', authRoutes.stack?.length || 'No routes found');
console.log('Task routes loaded:', taskRoutes.stack?.length || 'No routes found');

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 