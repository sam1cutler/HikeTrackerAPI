require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('./endpoint_users/users-router');
const hikesRouter = require('./endpoint_hikes/hikes-router');
const authRouter = require('./endpoint_auth/auth-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'dev' ;

app.use(morgan(morganOption));
app.use(helmet());

app.use(cors());
/*
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
*/


app.get('/', (req, res) => {
    res.send('Hello, hike-tracker-api user!');
})

app.use('/api/users', usersRouter);
app.use('/api/hikes', hikesRouter);
app.use('/api/auth', authRouter);


app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
})

module.exports = app;