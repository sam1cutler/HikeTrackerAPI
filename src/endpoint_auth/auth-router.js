const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
    .route('/login')
    .post(jsonBodyParser, (req, res, next) => {
        // pull out email and password from request body
        const { email, password } = req.body
        // use them to create a "loginUser" object
        const loginUser = { email, password }

        // confirm that both user_name and password have values
        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res
                    .status(400)
                        .json({
                            error: `Missing '${key}' in request body.`
                        })

        // Check that user exists
        AuthService.getUserWithUserEmail(
            req.app.get('db'),
            loginUser.email
        )
            .then(dbUser => {
                if (!dbUser) {
                    return res
                        .status(400)
                        .json({
                            error: 'Cannot find user.'
                        })
                }
                
                // check that the password in the request body MATCHES the (bcrypted) password for the FOUND user in the DB:
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if (!compareMatch) {
                            return res
                                .status(400)
                                .json({
                                    error: `Incorrect password.`
                                })
                        }
                        // at this point, user_name + password are validated! need to make JWT
                        // --> define the pre-encoding subject as the email from DB
                        const sub = dbUser.email
                        // --> define the pre-encoding payload as user ID object
                        const payload = { user_id: dbUser.id }
                        // use AuthService.createJwt to do just that, and then send the JWT to the client
                        res.send({
                            authToken: AuthService.createJwt(sub, payload),
                            //user_id: dbUser.id,
                        })
                    })
            })
            .catch(next)
    })

module.exports = authRouter;