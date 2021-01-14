const hikesService = {
    getAllHikes(knex) {
        return knex
            .select('*')
            .from('hike_tracker_hikes')
    },
    getHikeById(knex, id) {
        return knex
            .from('hike_tracker_hikes')
            .select('*')
            .where('id', id)
            .first()
    },
    insertHike(knex, newHike) {
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