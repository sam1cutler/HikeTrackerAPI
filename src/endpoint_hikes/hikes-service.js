const xss = require('xss');

const hikesService = {
    serializeHike(hike) {
        return {
            id: hike.id,
            user_id: hike.user_id,
            name: xss(hike.name),
            date: hike.date,
            distance: parseFloat(hike.distance),
            time: parseFloat(hike.time),
            elevation: hike.elevation,
            rating: hike.rating,
            steps: hike.steps,
            weather: hike.weather,
            notes: xss(hike.notes),
            reference: xss(hike.reference),
        }
    },
    getAllHikes(knex, user_id) {
        //console.log(`Need to filter for user with the id '${user_id}'`)
        return knex
            .select('*')
            .from('hike_tracker_hikes')
            .where(
                'user_id',
                '=',
                user_id
            )
    },
    getHikeById(knex, hike_id) {
        //console.log(`In hikes-service, looking for hike with id '${hike_id}'`)
        return knex
            .from('hike_tracker_hikes')
            .select('*')
            .where('id', hike_id)
            .first()
    },
    insertHike(knex, newHike) {
        //console.log('Running hikesService.insertHike, and inserting the following:')
        //console.log(newHike)
        return knex
            .insert(newHike)
            .into('hike_tracker_hikes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteHike(knex, id) {
        return knex
            .from('hike_tracker_hikes')
            .where( { id } )
            .delete()
    },
    updateHike(knex, id, newHikeInfo) {
        return knex
            .from('hike_tracker_hikes')
            .where( { id } )
            .update(newHikeInfo)
    },
}

module.exports = hikesService;