import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeDatabase } from './db/supabase.js'
import { errorHandler } from './middleware/errorHandler.js'
import studentRoutes from './routes/students.js'
import leaderboardRoutes from './routes/leaderboard.js'
import adminRoutes from './routes/admin.js'
import challengeRoutes from './routes/challenge.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))

app.use(express.json())

app.use('/api/students', studentRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/challenge', challengeRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

async function start() {
  try {
    await initializeDatabase()
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📝 Frontend URL: ${FRONTEND_URL}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
