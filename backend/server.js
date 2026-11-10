import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'CMS API is running' })
})

// ─── ERROR HANDLERS ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ─── START SERVER ─────────────────────────────────────────────────────────────
const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

start()