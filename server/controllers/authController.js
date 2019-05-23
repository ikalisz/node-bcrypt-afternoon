const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const {username, password, isAdmin} = req.body
        const db = req.app.get('db')
        const result = await db.get_user(username)
        //checks if the username already exists
        const existingUser = result[0]
        if (existingUser) {
            res.status(409).send(`Username taken`)
            //if it exists send back an error
        } else {
            //if it doesn't we register the user in our db and hash the password
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const registeredUser = await db.register_user([isAdmin, username, hash])
            console.log(registeredUser)
            const user = registeredUser[0]
            console.log(user)
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
            }
            //we send back the user object on our session
            res.status(201).send(req.session.user)
        }
    },
    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },
    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        const foundUser = await db.get_user([username])
        const user = foundUser[0]
        if (!user) {
            res.status(401).send(`User not found. Please register as a new user before logging in.`)
        } else {
            const isAuthenticated = bcrypt.compareSync(password, user.hash)
            if (!isAuthenticated) {
                res.status(403).send(`Incorrect password`)
            } else {
                req.session.user = {
                    isAdmin: user.is_admin,
                    id: user.id,
                    username: user.username
                }
                res.status(200).send(req.session.user)
            }
        }
    }
}