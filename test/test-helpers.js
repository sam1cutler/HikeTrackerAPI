const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const xss = require('xss');


function makeUsersArray() {
    return [
        {
            id: 1,
            email: 'test1@test.com',
            password: 'password'
        },
        {
            id: 2,
            email: 'test2@test.com',
            password: 'password'
        },
        {
            id: 3,
            email: 'test3@test.com',
            password: 'password'
        },
        {
            id: 4,
            email: 'test4@test.com',
            password: 'password'
        },
        {
            id: 5,
            email: 'test5@test.com',
            password: 'password'
        },
    ]
}

function makeNewUserObject() {
    return {
        id: 6,
        email: 'test6@test.com',
        password: 'abCD12#$'
    }
}

function makeHikesArray(users) {
    return [
        {
            id: 1,
            user_id: users[0].id,
            name: 'First',
            date: '01-Jan-2020',
            distance: 1,
            time: 1,
            elevation: 1000,
            rating: 3,
            steps: 3000,
            weather: 'Sun',
            notes: 'It was fine.',
            reference: 'http://www.wta.org/hike1',
        },
        {
            id: 2,
            user_id: users[1].id,
            name: 'Second',
            date: '02-Jan-2020',
            distance: 2,
            time: 2,
            elevation: 2000,
            rating: 4,
            steps: 4000,
            weather: 'Rain',
            notes: 'It was great.',
            reference: 'http://www.wta.org/hike2',
        },
        {
            id: 3,
            user_id: users[2].id,
            name: 'Third',
            date: '03-Jan-2020',
            distance: 3,
            time: 3,
            elevation: 3000,
            rating: 5,
            steps: 6000,
            weather: 'Clouds',
            notes: 'It was amazing.',
            reference: 'http://www.wta.org/hike3',
        },
        {
            id: 4,
            user_id: users[3].id,
            name: 'Fourth',
            date: '04-Jan-2020',
            distance: 4,
            time: 4,
            elevation: 4000,
            rating: 4,
            steps: 7000,
            weather: 'Snow',
            notes: 'It was was it is.',
            reference: 'http://www.wta.org/hike4',
        },
        {
            id: 5,
            user_id: users[0].id,
            name: 'Fifth',
            date: '05-Jan-2020',
            distance: 5,
            time: 5,
            elevation: 5000,
            rating: 2,
            steps: 10000,
            weather: 'Sun',
            notes: 'It was not great.',
            reference: 'http://www.wta.org/hike5',
        },
    ]
}

function makeNewHikeObject(users, hikes) {
    return {
        id: hikes.length+1,
        user_id: users[1].id,
        name: 'Sixth',
        date: '06-Jan-2020',
        distance: 6,
        time: 6,
        elevation: 6000,
        rating: 4,
        steps: 16000,
        weather: 'Sun',
        notes: 'I had fun.',
        reference: 'http://www.wta.org/hike6',
    }
}

function serializeHike(hike) {
    const interimDate = new Date(hike.date).toISOString()
    
    return {
        id: hike.id,
        user_id: hike.user_id,
        name: xss(hike.name),
        date: interimDate,
        distance: hike.distance,
        time: hike.time,
        elevation: hike.elevation,
        rating: hike.rating,
        steps: hike.steps,
        weather: hike.weather,
        notes: xss(hike.notes),
        reference: xss(hike.reference),
    }
}

function serializeUser(user) {
    function makeHashedPassword(input) {
        bcrypt.hash(input, 12)
        .then(newPass => {
            console.log(newPass)
            return newPass
        })
    }
    const newPassword = makeHashedPassword(user.password)
    return {
        id: user.id,
        email: user.email,
        password: newPassword,
    }
}

function makeHikesFixtures() {
    const testUsers = makeUsersArray();
    const testHikes = makeHikesArray(testUsers);
    return { testUsers, testHikes};
}

function cleanTables(db) {
    return db.transaction(trx => 
        trx.raw(
            `TRUNCATE
                hike_tracker_users,
                hike_tracker_hikes
                RESTART IDENTITY
            `
        )
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        { user_id: user.id },
        secret, {
            subject: user.email,
            algorithm: 'HS256'
        })
    return `bearer ${token}`;
}

module.exports = {
    makeUsersArray,
    makeNewUserObject,
    makeHikesArray,
    makeNewHikeObject,
    makeHikesFixtures,
    cleanTables,
    makeAuthHeader,
    serializeHike,
    serializeUser,
}