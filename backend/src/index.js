require('dotenv').config()
require('./cron/notification.cron')
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const multer = require('multer');

const app = express()
const prisma = new PrismaClient()


// ============== Middleware =================

const allowedOrigins = [
  "http://localhost:3000", 
  "https://simkas.vercel.app",          
];

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cek koneksi DB saat startup
async function checkDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')
  } catch (err) {
    console.error('❌ Database connection failed:', err)
    process.exit(1)
  }
}

// Static file serving for uploads
app.use('/uploads', express.static('uploads'))

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Event Management API is running' })
})

// AUTH
const authRoutes = require('./routes/auth.route')
app.use('/auth', authRoutes)

// EVENT
const eventRoutes = require('./routes/event.route')
app.use('/events', eventRoutes)

// REGISTRATION
const registrationRoute = require('./routes/registration.route')
app.use('/registration', registrationRoute)

// NOTIFICATION
const notificationRoutes = require('./routes/notification.route')
app.use('/notifications', notificationRoutes)

// DASHBOARD
const dashboardRoutes = require('./routes/dashboard.route')
app.use('/dashboard', dashboardRoutes)

// CERTIFICATE
const certificateRoutes = require('./routes/certificate.route')
app.use('/certificates', certificateRoutes)

// USER
const userRoutes = require('./routes/user.route')
app.use('/user', userRoutes)

// GALLERY
const galleryRoutes = require('./routes/gallery.route')
app.use('/galleries', galleryRoutes)

// Port
const PORT = process.env.PORT || 3000

app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "Error" && err.http_code) {
    return res.status(err.http_code).json({ error: err.message });
  }

  return res
    .status(500)
    .json({ error: err.message || "Internal Server Error", details: err });
});

// Start server
checkDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
})
