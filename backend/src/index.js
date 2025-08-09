require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(cors())
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

const cron = require('node-cron');
const notificationService = require('./services/notification.service');

// DELETE OLD NOTIFICATIONS
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await notificationService.deleteOldReadNotifications();
    console.log(`Cron job: ${result.count} notifikasi lama dihapus`);
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Port
const PORT = process.env.PORT || 3000

// Start server
checkDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
})
