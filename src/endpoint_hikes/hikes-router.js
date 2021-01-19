const path = require('path');
const express = require('express');
const xss = require('xss');
const hikesService = require('./hikes-service');
//const { time } = require('console');
//const { requireAuth } = require('../middleware/jwt-auth');

const hikesRouter = express.Router();
const jsonParser = express.json();

const serializeHike = hike => ({
    id: hike.id,
    user_id: hike.user_id,
    name: xss(hike.name),
    date: hike.date,
    distance: hike.distance,
    time: hike.time,
    elevation: hike.elevation,
    weather: hike.weather,
    notes: xss(hike.notes),
    reference: xss(hike.reference),
    social_reference: xss(hike.social_reference),
    steps: hike.steps
})

hikesRouter
    .route('/')
    .get( (req, res, next) => {
        hikesService.getAllHikes(req.app.get('db'))
            .then(hikes => {
                res.json(hikes.map(serializeHike))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { user_id, name, date, distance, time, elevation, weather, notes, reference, social_reference, steps } = req.body;
        const checkReqs = { user_id, name, date };

        for (const [key, value] of Object.entries(checkReqs)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        error: {message: `New hike submission must have '${key}' included.`}
                    })
            }
        }

        const newHike = { user_id, name, date, distance, time, elevation, weather, notes, reference, social_reference, steps }

        hikesService.insertHike(
            req.app.get('db'),
            newHike
        )
            .then(hike => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${hike.id}`))
                    .json(serializeHike(hike))
            })
            .catch(next)
    });

hikesRouter
    .route('/:hikeId')
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
        res.json(serializeHike(res.hike))
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