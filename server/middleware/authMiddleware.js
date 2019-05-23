
module.exports = {
    usersOnly: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.status(401).send('Please log in')
        }
    },
    adminOnly: (req, res, next) => {
        if (req.session.user.isAdmin) {
            next()
        } else {
            res.status(403).send('Admins only')
        }
    }
}