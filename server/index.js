require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/audit-logs', require('./routes/audit-logs'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/lumina-ai', require('./routes/lumina-ai-enhanced')); // Enhanced Alt-X AI
app.use('/api/lumina-ai-local', require('./routes/lumina-ai-gemini')); // 🆓 GOOGLE GEMINI (FREE!)
app.use('/api/lab-reports', require('./routes/lab-reports'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
