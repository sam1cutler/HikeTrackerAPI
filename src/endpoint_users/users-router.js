const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');
//const { hasUserWithEmail } = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
    id: user.id,
    email: xss(user.email),
    password: xss(user.password),
})

usersRouter
    .route('/')
    .get( (req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { email, password } = req.body;
        const newUser = { email, password };

        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        error: {message: `New user submission must have '${key}' included.`}
                    });
            };
        };

        const passwordError = UsersService.validatePassword(password);

        if (passwordError) {
            return res
                .status(400)
                .json({
                    error: passwordError
                });
        };

        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(dbHasUserWithEmail => {
                if (dbHasUserWithEmail) {
                    return res
                        .status(400)
                        .json({
                            error: `User with that email address already exists.`
                        })
                }
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            email,
                            password: hashedPassword,
                        }
                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(serializeUser(user))
                            })
                    })
            })
            .catch(next)
    });

usersRouter
    .route('/:userId')
    .all( (req, res, next) => {
        UsersService.getUserById(
            req.app.get('db'),
            req.params.userId
        )
            .then(user => {
                if (!user) {
                    return res
                        .status(404)
                        .json({
                            error: { message: `The user with ID '${req.params.userId}' does not exist.`}
                        })
                }
                res.user = user;
                next()
            })
    })
    .get( (req, res, next) => {
        res.json(serializeUser(res.user))
    })
    .delete( (req, res, next) => {
        UsersService.deleteUser(
            req.app.get('db'),
            req.params.userId
        )
            .then( () => {
                res.status(204).end()
            })
    })
    .patch(jsonParser, (req, res, next) => {
        const { email, password } = req.body;
        const updatedUserInfo = { email, password };
        const numberOfChanges = Object.values(updatedUserInfo).filter(Boolean).length;

        if (numberOfChanges === 0) {
            return res
                .status(400)
                .json({
                    error: { message: `Must update at least one of 'email' or 'password'.`}
                })
        }

        UsersService.updateUser(
            req.app.get('db'),
            req.params.userId,
            updatedUserInfo
        )
            .then( () => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = usersRouter;