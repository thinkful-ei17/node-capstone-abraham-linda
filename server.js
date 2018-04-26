'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { PORT, DATABASE_URL } = require('./config');
const itemsRouter = require('./items/v1/router');
const bodyParser = require('body-parser');const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(morgan('common'));
app.use(bodyParser.json());
app.use('/api/v1',itemsRouter);

const path = require('path'); //needed to test html file (static)
app.use(express.static(path.join(__dirname, 'public'))); //needed to test html file (static)

app.get('/api/v1', (req, res)=>{
  res.json({message: 'Hello, World!'}); //test server
});

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
