const express = require('express');
const cors = require('cors');
const app = express();

const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationroutes');

// Middleware
app.use(cors({origin: 'https://frontendjob.netlify.app/', // or '*' for testing
  credentials: true}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message 
  });
});

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
