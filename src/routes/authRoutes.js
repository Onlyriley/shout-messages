import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register', (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        // Create a default todo
        const defaultTodo = "Welcome! Add your first Message!"
        const insertTodo = db.prepare(`INSERT INTO messages (user_id, content) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)
        // Create a token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) { // database connection failed
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username)

        if (!user) {return res.status(404).send({message: "User not found"})}

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {return res.status(401).send({message: "Invalid Password"})}

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err)
        res.sendStatus(503)
    }
})

export default router