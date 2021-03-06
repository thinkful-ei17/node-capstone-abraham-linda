'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const { Item } = require('./model');
const router = express.Router();

router.use(jsonParser);

mongoose.Promise = global.Promise;

let items; //RN: take out 

//GET (Read) method endpoint '/items'
//finds and returns all documents that are a part of Items db
//sorted by id in descending order (largest to smallest)
router.get('/items', (req, res) => {
  Item.find({},{}, {sort: {_id: -1}})
    .then(list => {
      res.json(list);
    })
    .catch(err =>{
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    }); //error handler
});

//GET (Read) method endpoint '/items/id'
//finds and returns document of requested id parameter 
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

//POST (Create) method endpoint '/items'
//req passes through jsonParser middleware which parses the request body to JSON
//validate if required fields/values are included in the request body, if not, then return error that specifies which field is missing (first failed field)
//obtain the fields/values desired from req.body
//set status field value depending on type (switch)
//define newItem with fieds/values
//create (add) to Items db
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
        res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item); //201 handler
      } //RN: possibly mashing styles by using res.location only here; maybe return value (more valuable info)
    })
    .catch(err => console.error(`Error: ${err.message}`)); //error handler
});


//Return toggle
//PUT (Update) method endpoint '/items/return/:id'
//Update existing item ('Return' button)
//capture id parameter value
//capture status body value
//capture acceptedBy body value
//set status back to 'Borrow'
//set acceptedBy back to null
//find item in Items db by id, then update values for acceptedBy and status
router.put('/items/return/:id', (req, res) => {
  const id = req.params.id;
  const type = req.body.type;

   /***** Never trust users - validate input *****/
  const requiredFields = ['acceptedBy', 'status', 'type'];

  const missingFields = requiredFields.filter(field => !(field in req.body)); //only returns 1 missing field (stops at first field fail)
//if you use find - name in singular

  Item.findById(id)
  .then(item => {
    if ((item.type === 'Loan') && (item.status === 'On Loan')) {
      let acceptedBy = null; //RN: const; can just pass directly - only one instance (rot)
      let status = 'Borrow'; //RN: const; can just pass directly - only one instance (rot)
        Item.findByIdAndUpdate(id, {acceptedBy: acceptedBy, status: status})
        .then(() => res.status(204).end()) //204 handler
        .catch(err => console.error(`Error: ${err.message}`)); //error handler
    }
  })
  .catch(err => {
    res.status(500).send({message: 'Internal Server Error'});
  });  // error handler
});

//Edit feature
//PUT (Update) method endpoint '/items/edit/:id'
//Update existing item ('Edit' button)
//validate if updateable fields are included in the request body
//obtain the new fields/values desired from req.body
//define replaceItem with new fieds/values
//find by id in Item db the item that will be updated and pass in the replaceItem updated values
router.put('/items/edit/:id', (req, res) => {
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
        res.status(204).end(); //must put .end so response does not hang in limbo //204 handler
      } 
    })
    .catch(err => console.error(`Error: ${err.message}`)); //error handler
});

//Action Buttons
//PUT (Update) method endpoint '/items/clain/:id/:acceptedBy'
//Update existing item ('Claim', 'Purchase', 'Borrow' buttons)
//capture id parameter value
//capture acceptedBy user parameter value (user who clicked button)
//capture type body value
//based on type, set status
//find item in Items db by id, then update values for acceptedBy and status
router.put('/items/claim/:id', (req, res) => {
  const id = req.params.id;
  const user = req.body.acceptedBy;
  const type = req.body.type;
  let status;

  switch(type){
    case 'Free':
      status = 'Claimed'
      break;
    case 'Loan':
     status = 'On Loan'
      break;
    case 'Sell':
      status = 'Purchased'
      break;
  }

    Item.findByIdAndUpdate(id, {acceptedBy: user, status: status})
    .then(() => res.status(204).end()) //204 handler
  .catch(err => console.error(`Error: ${err.message}`)); //error handler
});

//DELETE (delete) method endpoint '/items/:id'
//Delete item ('Delete' button)
//capture id parameter value
//find item by id in Items db and remove
router.delete('/items/:id', (req, res) => {
  const id = req.params.id;
  
  Item.findByIdAndRemove(id)
      .then(count => {
        if (count) {
          res.status(204).end(); //204 handler
        } else {
          res.status(404).end(); //404 handler
        }
      })
      .catch(err => {
        res.status(500).send({message: 'Internal Server Error'});
      }); // error handler
  });

module.exports = router;