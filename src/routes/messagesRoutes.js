import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
    const getMessages = db.prepare(`
        SELECT messages.*, users.username
        FROM messages
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.id DESC LIMIT 10
    `)
    const messages = getMessages.all()
    res.json(messages)
})

router.post('/', (req, res) => {
    const { content } = req.body
    const insertMessage = db.prepare(`INSERT INTO messages (user_id, content) VALUES (?, ?)`)
    const result = insertMessage.run(req.userId, content)
    res.json({message: "Message Sent!"})
})

// Here is where a UPDATE and DELETE route would be, however that will not be necessary

export default router