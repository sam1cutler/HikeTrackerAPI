const path = require('path');
const express = require('express');
const hikesService = require('./hikes-service');
const JwtService = require('../middleware/jwt-auth');

const hikesRouter = express.Router();
const jsonParser = express.json();

hikesRouter
    .route('/')
    .all(JwtService.requireAuth)
    .get( (req, res, next) => {
        hikesService.getAllHikes(
            req.app.get('db'),
            req.user.id
        )
            .then(hikes => {
                res.json(hikes.map(hikesService.serializeHike))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, date, distance, time, elevation, rating, steps, weather, notes, reference } = req.body;
        const checkReqs = { name, date };

        for (const [key, value] of Object.entries(checkReqs)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        error: {message: `New hike submission must have '${key}' included.`}
                    })
            }
        }

        const newHike = {
            user_id: req.user.id,
            name,
            date,
            distance,
            time,
            elevation,
            rating,
            steps,
            weather,
            notes,
            reference
        }

        hikesService.insertHike(
            req.app.get('db'),
            newHike
        )
            .then(hike => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${hike.id}`))
                    .json(hikesService.serializeHike(hike))
            })
            .catch(next)
    });

hikesRouter
    .route('/:hikeId')
    .all(JwtService.requireAuth)
    .all( (req, res, next) => {
        hikesService.getHikeById(
            req.app.get('db'),
            req.params.hikeId
        )
            .then(hike => {
                if (!hike) {
                    return res
                        .status(404)
                        .json({
                            error: { message: `The hike with ID '${req.params.hikeId}' does not exist.`}
                        })
                }
                res.hike = hike;
                next()
            })
    })
    .get( (req, res, next) => {
        res.json(hikesService.serializeHike(res.hike))
    })
    .delete( (req, res, next) => {
        hikesService.deleteHike(
            req.app.get('db'),
            req.params.hikeId
        )
            .then( () => {
                res.status(204).end()
            })
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, date, distance, time, elevation, rating, steps, weather, notes, reference } = req.body;
        const updatedHikeInfo = {
            user_id: req.user.id,
            name,
            date,
            distance,
            time,
            elevation,
            rating,
            steps,
            weather,
            notes,
            reference
        }

        hikesService.updateHike(
            req.app.get('db'),
            req.params.hikeId,
            updatedHikeInfo
        )
            .then( () => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = hikesRouter;