'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const { Item } = require('./model');
const router = express.Router();

router.use(jsonParser);

mongoose.Promise = global.Promise;

let items; 

router.get('/items', (req, res, next) => {
  Item.find()
    .then(list => {
      res.json(list);
    })
    .catch(next);
});

// router.get('/:id', (req, res, next) => {
//   const id = req.params.id;

//   items.findByIdAsync(id)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next);  // error handler
// });

router.post('/items', jsonParser, (req, res) => {
  /***** Never trust users - validate input *****/
  const requiredFields = ['name', 'type', 'postedBy', 'status'];

  const missingFields = requiredFields.filter(field => !(field in req.body)); //only returns 1 missing field (stops at first field fail)
//if you use find - name in singular

  // if (missingFields){
  //   console.log('Hi from Error Block :)');
  //   const err = new Error(`Missing required field ${missingFields}`);
  //   return res.status(400).json(err.message);
  // }

  const { name, image, type, description, postedBy, acceptedBy, status } = req.body;

  // if (!name) {
  //   const err = new Error('Missing `name` in request body');
  //   err.status = 400;
  //   return next(err); // error handler
  // }
  const newItem = {name, image, type, description, postedBy, acceptedBy, status };

  // create
  Item.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
      }
    })
    .catch(err => console.error(`Error: ${err.message}`));
});

// router.put('/:id', (req, res, next) => {
//   const id = req.params.id;

//   /***** Never trust users - validate input *****/
//   const replaceItem = {};
//   const updateableFields = ['name', 'checked'];

//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       replaceItem[field] = req.body[field];
//     }
//   });

//   /***** Never trust users - validate input *****/
//   if (!replaceItem.name) {
//     const err = new Error('Missing `name` in request body');
//     err.status = 400;
//     return next(err); // error handler
//   }

//   // replace
//   items.findByIdAndReplaceAsync(id, replaceItem)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next); // error handler
// });

// router.patch('/:id', (req, res, next) => {
//   const id = req.params.id;

//   /***** Never trust users - validate input *****/
//   const replaceItem = {};
//   const updateableFields = ['name', 'checked'];
  
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       replaceItem[field] = req.body[field];
//     }
//   });

//   // update
//   items.findByIdAndUpdateAsync(id, replaceItem)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next); // error handler
// });

// router.delete('/:id', (req, res, next) => {
//   const id = req.params.id;

//   items.findByIdAndRemoveAsync(id)
//     .then(count => {
//       if (count) {
//         res.status(204).end();
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next); // error handler
// });



module.exports = router;