const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');

describe('Users Endpoints', function() {
    let db

    const testUsers = helpers.makeUsersArray();

    before('Make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    });

    after('disconnect form db', () => db.destroy() );

    before('cleanup', () => helpers.cleanTables(db) );

    afterEach('cleanup', () => helpers.cleanTables(db) );

    describe(`1) POST /api/users`, () => {
        context(`Given users in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('hike_tracker_users')
                    .insert(testUsers)
                    .then( () => {
                        return db.max('id').from('hike_tracker_users')
                    })
                        .then( (maxId) => {
                            return db.raw(`ALTER SEQUENCE hike_tracker_users_id_seq RESTART WITH ${maxId[0].max+1};`)
                        })
            })

            it(`responds with 201`, () => {
                const newUser = helpers.makeNewUserObject();
                
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
            })
        })
    })
    
});