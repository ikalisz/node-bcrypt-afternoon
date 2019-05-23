require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

//middleware
app.use(express.json())
//below sets our session
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))
massive(CONNECTION_STRING)
//connecting databse
.then(db => {
    app.set('db', db)
    console.log('Database connected')
})
//endpoints
app.post('/auth/register', authCtrl.register)
app.get('/auth/logout', authCtrl.logout)
app.post('/auth/login', authCtrl.login)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminOnly, treasureCtrl.getAllTreasure)
app.listen(SERVER_PORT, () => {
    console.log(`Working on port ${SERVER_PORT}`)
})