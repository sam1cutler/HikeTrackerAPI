const usersService = {
    getAllUsers(knex) {
        return knex
            .select('*')
            .from('hike_tracker_users')
    },
    getUserById(knex, id) {
        return knex
            .from('hike_tracker_users')
            .select('*')
            .where('id', id)
            .first()
    },
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('hike_tracker_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteUser(knex, id) {
        return knex
            .from('hike_tracker_users')
            .where( { id } )
            .delete()
    },
    updateUser(knex, id, newUserInfo) {
        return knex
            .from('hike_tracker_users')
            .where( { id } )
            .update(newUserInfo)
    },
}

module.exports = usersService;