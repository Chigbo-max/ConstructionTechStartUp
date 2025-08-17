const express = require('express');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const milestoneRoutes = require('./routes/milestones');
const professionalRoutes = require('./routes/professionals');
const jobRoutes = require('./routes/jobs');
const notificationsRoutes = require('./routes/notifications')
const cors = require('cors');


const app = express();


// Enhanced CORS configuration
const allowedOrigins = [
    'https://christianprofessionalsnetwork.onrender.com',
    'http://localhost:5173'
  ];
  
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }));
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {});
};

module.exports = app;