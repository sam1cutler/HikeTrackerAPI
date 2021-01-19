const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
    getUserWithUserEmail(db, email) {
        console.log('In AuthService, checking for user with that email')
        console.log(email)
        return db('hike_tracker_users')
            .where({ email })
            .first()
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
        console.log('In AuthService, generating JWT')
        return jwt.sign(payload, config.JWT_SECRET, {
            subject, algorithm: 'HS256',
        })
    },
}

module.exports = AuthService