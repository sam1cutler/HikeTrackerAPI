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

    describe(`1) GET /api/hikes`, () => {
        context(`Given hikes in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('hike_tracker_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('hike_tracker_hikes')
                    .insert(testHikes)
            })

            it('responds with 200 and all the hikes', () => {
                const activeUser = testUsers[0]
                const expectedHikes1 = testHikes.filter(hike => 
                    hike.user_id === activeUser.id
                );
                const expectedHikes2 = expectedHikes1.map(hike => 
                    helpers.serializeHike(hike)
                );
                return supertest(app)
                    .get('/api/hikes')
                    .set('Authorization', helpers.makeAuthHeader(activeUser))
                    .expect(200, expectedHikes2)
            })
        })
    })

    describe(`2) POST /api/hikes`, () => {
        context(`Given hikes in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('hike_tracker_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('hike_tracker_hikes')
                    .insert(testHikes)
                    // need to reset seq counter to latest #
                    .then( () => {
                        return db.max('id').from('hike_tracker_hikes')
                    })
                        .then( (maxId) => {
                            //console.log(maxId)
                            return db.raw(`ALTER SEQUENCE hike_tracker_hikes_id_seq RESTART WITH ${maxId[0].max+1};`)
                        })
                        
            })

            it('Responds with 201 and adds new hike to database', () => {
                const activeUser = testUsers[1];
                const newHike = helpers.makeNewHikeObject(testUsers, testHikes);
                return supertest(app)
                    .post('/api/hikes')
                    .set('Authorization', helpers.makeAuthHeader(activeUser))
                    .send(newHike)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.name).to.eql(newHike.name)
                    })
                    .then( () => {
                        testHikes.push(newHike);
                        const expectedHikes1 = testHikes.filter(hike => 
                            hike.user_id === activeUser.id
                        );
                        const expectedHikes2 = expectedHikes1.map(hike => 
                            helpers.serializeHike(hike)
                        );
                        return supertest(app)
                            .get('/api/hikes')
                            .set('Authorization', helpers.makeAuthHeader(activeUser))
                            .expect(200, expectedHikes2)
                    })
                    
            })
        })
    })

    describe(`3) GET /api/hikes/:hikeId`, () => {
        context(`Given hikes in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('hike_tracker_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('hike_tracker_hikes')
                    .insert(testHikes)
            })

            it(`responds with 200 and the requested hike`, () => {
                const desiredHikeId = 1;
                const activeUser = testUsers[0]
                const expectedHike = helpers.serializeHike(testHikes[desiredHikeId - 1]);

                return supertest(app)
                    .get(`/api/hikes/${desiredHikeId}`)
                    .set('Authorization', helpers.makeAuthHeader(activeUser))
                    .expect(200, expectedHike);
            });
        })
    })

    describe(`4) PATCH /api/hikes/:hikeId`, () => {
        context(`Given hikes in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('hike_tracker_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('hike_tracker_hikes')
                    .insert(testHikes)
            })

            it('responds with 204 and updates info about the correct hike', () => {
                const activeUser = testUsers[1];
                const targetHikeId = 3
                const updatedHikeInfo = {
                    name: 'New hike name',
                    notes: 'New hike notes'
                }
                return supertest(app)
                    .patch(`/api/hikes/${targetHikeId}`)
                    .set('Authorization', helpers.makeAuthHeader(activeUser))
                    .send(updatedHikeInfo)
                    .expect(204)
                    .then( () => {
                        return supertest(app)
                        .get(`/api/hikes/${targetHikeId}`)
                        .set('Authorization', helpers.makeAuthHeader(activeUser))
                        .expect(200)
                        .then( (res) => {
                            expect(res.body.name).to.eql(updatedHikeInfo.name)
                            expect(res.body.notes).to.eql(updatedHikeInfo.notes)
                        })
                    })
            })
        })
    })

    describe(`5) DELETE /api/hikes/:hikeId`, () => {
        context(`Given hikes in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('hike_tracker_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('hike_tracker_hikes')
                    .insert(testHikes)
            })

            it(`responds with 204 and removes the requested hike from DB`, () => {
                const desiredHikeId = 1;
                const activeUser = testUsers[0]
                const expectedHikeList1 = testHikes.filter(hike => 
                    hike.id !== desiredHikeId );
                const expectedHikeList2 = expectedHikeList1.filter(hike => 
                    hike.user_id === activeUser.id
                );
                const expectedHikeList3 = expectedHikeList2.map(hike => 
                    helpers.serializeHike(hike)
                );
                return supertest(app)
                    .delete(`/api/hikes/${desiredHikeId}`)
                    .set('Authorization', helpers.makeAuthHeader(activeUser))
                    .expect(204)
                        .then( () => {
                            return supertest(app)
                            .get(`/api/hikes`)
                            .set('Authorization', helpers.makeAuthHeader(activeUser))
                            .expect(200, expectedHikeList3)
                        })
            });
        })
    })

});