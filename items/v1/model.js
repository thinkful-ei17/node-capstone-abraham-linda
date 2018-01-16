'use strict';

const mongoose = require('mongoose');

//this is our schema to represent an item
const itemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  image: {type: String, default: null}, //paste URL
  type: {type: String, required: true, enum: ['Sell', 'Loan', 'Free']},
  description: {type: String, default: null},
  postedBy: {type: String, required: true},
  acceptedBy: {type: String, default: null},
  status: {type: String, enum: ['Make Offer', 'Purchased', 'Claim', 'Claimed', 'Borrow', 'On Loan']},
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
// this can also be used to expose the generated id
itemSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    description: this.description,
    postedBy: this.postedBy,
    acceptedBy: this.acceptedBy,
    status: this.status
  };
};

const Item = mongoose.model('Item', itemSchema);

module.exports = {Item};


/*
item = {
  "name":'Lawn Mower',
  "image":'img.jpg',
  "type": 'Loan',
  "description":'Brand new Lawn mower sitting in my garage collecting dust. Now that I have astro-truf. Go ahead and borrow it if you need it! - Alice',
  "postedBy": 'Alice A.'
  "acceptedBy": 'Charlie C.'
  "status":'On Loan'
  };

1. if Type = "Sell"
IF status = "Make Offer" (Available)
IF status = "Purchased" (No longer available)

2. if Type = "Free"
IF status = "Claim" (Available)
IF status = "Claimed" (no longer available)

3. If Type = "Loan"
IF status = "Borrow" (Available)
IF status = "On Loan" (no longer available)


*/  