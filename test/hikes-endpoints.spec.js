const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Hikes Endpoints', function() {
    let db

    const {
        testUsers,
        testHikes,
    } = helpers.makeHikesFixtures();

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

    describe(`GET /api/hikes`, () => {
        context(`Given hikes in the database`, () => {
            beforeEach('insert hikes', () => {
                helpers.seedHikesTables(
                    db,
                    testUsers,
                    testHikes,
                )
            })

            it('responds with 200 and all the hikes', () => {
                console.log('In the test.')
                console.log(testUsers)
                const expectedHikes = testHikes;
                return supertest(app)
                    .get('/api/hikes')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedHikes)
            })
        })
    })

});