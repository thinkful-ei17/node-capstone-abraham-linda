'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const { Item } = require('./model');
const router = express.Router();
const passport = require('passport');

const { router: jwtStrategy } = require('../../auth');

router.use(jsonParser);

mongoose.Promise = global.Promise;

let items; 

router.get('/items', (req, res) => {
  Item.find({},{}, {sort: {_id: -1}})
    .then(list => {
      res.json(list);
    })
    .catch(err =>{
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});


passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jwtAuth);

router.get('/items/:id', (req, res) => {
  const id = req.params.id;

  Item.findById(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).end(); // 404 handler
      }
    })
    .catch(err => {
      res.status(500).send({message: 'Internal Server Error'});
    });  // error handler
});

router.post('/items', jsonParser, (req, res) => {
  /***** Never trust users - validate input *****/
  const requiredFields = ['name', 'type', 'postedBy'];

  const missingFields = requiredFields.filter(field => !(field in req.body)); //only returns 1 missing field (stops at first field fail)
//if you use find - name in singular

  const { name, image, type, description, postedBy } = req.body;

  let status;

  switch(type){
  case 'Sell':
    status = 'Make Offer';
    break;
  case 'Loan':
    status = 'Borrow';
    break;
  case 'Free':
    status = 'Claim';
    break;
  }
  
  const newItem = {name, image, type, description, postedBy, status };

  // create
  Item.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
      }
    })
    .catch(err => console.error(`Error: ${err.message}`));
});

router.put('/items/:id', (req, res) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['name', 'image', 'type', 'description'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  Item.findByIdAndUpdate(id, replaceItem)
    .then(item => {
      if (item) {
        res.status(204).end(); //must put .end (send empty object) so it does not hang in limbo
      } 
    });
});

router.put('/items/:id/:acceptedBy', (req, res) => {
  console.log('router ran');
  const id = req.params.id;
  const user = req.params.acceptedBy;
  const type = req.body.type;
  let status;

  switch(type){
  case 'Free':
    status = 'Claimed';
    break;
  case 'Loan':
    status = 'On Loan';
    break;
  case 'Sell':
    status = 'Purchased';
    break;
  }

  Item.findById(id)
  .then(item => {
    Item.findByIdAndUpdate(id, {acceptedBy: user, status: status})
    .then(() => res.status(204).end());
  });
});
  // find one (id); return type, then based on this type; status should be xxx - swtich in here
  // if(req.type)

  // switch(event.target[3].value) {
  //   case 'Sell':
  //   claimDocument.status = 'Purchased'
  //   break;

  //   case 'Free':
  //   const claimDocument = {
  //     id: id,
  //     acceptedBy: STORE.currentUser,
  //     status: 'Claimed'
  //   }
  //   break;
  //   case 'Loan':
  //   const claimDocument = {
  //     id: id,
  //     acceptedBy: STORE.currentUser,
  //     status: 'On Loan'
  //   }
  //   break;

  /***** Never trust users - validate input *****/
  // const replaceItem = {};
  // const updateableFields = ['status'];

  // updateableFields.forEach(field => {
  //   if (field in req.body) {
  //     replaceItem[field] = req.body[field];
  //   }
  // });

  // Item.findByIdAndUpdate(id, replaceItem)
  //   .then(item => {
  //     if (item) {
  //       res.status(204).end(); //must put .end (send empty object) so it does not hang in limbo
  //     } 
  //   });

router.delete('/items/:id', (req, res) => {
  const id = req.params.id;
  
  Item.findByIdAndRemove(id)
      .then(count => {
        if (count) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      })
      .catch(err => {
        res.status(500).send({message: 'Internal Server Error'});
      }); // error handler
});

module.exports = router;