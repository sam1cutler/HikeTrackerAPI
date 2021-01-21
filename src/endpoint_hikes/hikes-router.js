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
        console.log('In the hikesRouter get request, with req.user = ')
        console.log(req.user)
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
        console.log('Now really starting the POST request.')
        const { name, date, distance, time, elevation, weather, notes, reference, social_reference, steps } = req.body;
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

        console.log('Request cleared cursory check.')

        const newHike = {
            user_id: req.user.id,
            name,
            date,
            distance,
            time,
            elevation,
            weather,
            notes,
            reference,
            social_reference,
            steps
        }
        console.log(newHike)

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
        const { user_id, name, date, distance, time, elevation, weather, notes, reference, social_reference, steps } = req.body;
        const updatedHikeInfo = { user_id, name, date, distance, time, elevation, weather, notes, reference, social_reference, steps };
        const numberOfChanges = Object.values(updatedHikeInfo).filter(Boolean).length;

        if (numberOfChanges === 0) {
            return res
                .status(400)
                .json({
                    error: { message: `Must update some attribute of this logged hike.`}
                })
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