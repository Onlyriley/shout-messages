import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from './middleware/authMiddleware.js'
import authRoutes from './routes/authRoutes.js'
import messagesRoutes from './routes/messagesRoutes.js'


const app = express()
const PORT = process.env.PORT || 8080

// Locate the current module directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/auth', authRoutes)
app.use('/messages', authMiddleware, messagesRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})