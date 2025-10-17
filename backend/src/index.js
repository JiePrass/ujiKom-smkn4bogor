require('dotenv').config();
require('./cron/notification.cron');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  "http://localhost:3000",
  "https://simkas.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static
app.use('/uploads', express.static('uploads'));

// ✅ Default route
app.get('/', (req, res) => {
  res.json({ message: 'Event Management API is running' });
});

// ✅ Routes
app.use('/auth', require('./routes/auth.route'));
app.use('/events', require('./routes/event.route'));
app.use('/registration', require('./routes/registration.route'));
app.use('/notifications', require('./routes/notification.route'));
app.use('/dashboard', require('./routes/dashboard.route'));
app.use('/certificates', require('./routes/certificate.route'));
app.use('/user', require('./routes/user.route'));
app.use('/galleries', require('./routes/gallery.route'));

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);

  if (err instanceof multer.MulterError)
    return res.status(400).json({ error: err.message });

  return res.status(500).json({
    error: err.message || "Internal Server Error",
    details: err,
  });
});

// ✅ DB Check + Start Server
async function checkDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;
checkDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
