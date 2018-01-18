'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { PORT, DATABASE_URL } = require('./config');
const itemsRouter = require('./items/v1/router');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passport = require('passport');

const app = express();


const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
mongoose.Promise = global.Promise;

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });


// Middleware
app.use(morgan('common'));
app.use(bodyParser.json());


app.get('/api/v1', (req, res)=>{
  res.json({message: 'Hello World, from project Sharing is Caring!'}); //test server
});

app.use('/api/v1', jwtAuth, itemsRouter);

const path = require('path'); //needed to test html file (static)
app.use(express.static(path.join(__dirname, 'public'))); //needed to test html file (static)




let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}


function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
