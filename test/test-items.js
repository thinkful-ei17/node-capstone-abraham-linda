'use strict';

//NOTE: IMPORTANT - WHEN CONNECTING TRAVISCI and HEROKU, yml 'app' must reflect HEROKU database name

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker'); //library that helps with generating random seedData
const mongoose = require('mongoose'); //library to help with db interaction

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const { Item } = require('../items/v1/model');
const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL_TEST} = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedItemData() {
  console.info('seeding item data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateCreateItemData());
  }

  //For future test
  // for (let i=1; i<=10; i++) {
  //   seedData.push(generateEditItemData());
  // }

  // this will return a promise
  return Item.insertMany(seedData);
}


function randomize(array) {
  return array[Math.floor(Math.random()*array.length)];
}

function generateRandomTypeAndStatus(){
  const types = ['Loan','Sell','Free'];

  const randomType = randomize(types);
  let randomStatus;
  switch(randomType){
  case 'Loan':
    randomStatus = 'Borrow';
    break;
  case 'Sell':
    randomStatus = 'Make Offer';
    break;
  case 'Free':
    randomStatus = 'Claim';
    break;
  }
 
  return {type: randomType, status: randomStatus};
}


// Future test use
// function generateRandomTypeAndStatusEdit(){
//   const types = ['Loan','Sell','Free'];

//   const randomType = randomize(types);
//   let randomStatus;
//   switch(randomType){
//   case 'Loan':
//     randomStatus = 'On Loan';
//     break;
//   case 'Sell':
//     randomStatus = 'Purchased';
//     break;
//   case 'Free':
//     randomStatus = 'Claimed';
//     break;
//   }
 
//   return {type: randomType, status: randomStatus};
// }

// generate an object representing an item.
// can be used to generate seed data for db
// or request.body data
function generateCreateItemData() {
  let pName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
  const randomized = generateRandomTypeAndStatus();
  const availableStatuses = ['Borrow', 'Claim', 'Make Offer'];

  return {
    name: faker.commerce.productName(),
    type: randomized.type,
    description: faker.lorem.sentence(),
    postedBy: pName,
    acceptedBy: null,
    status: randomized.status
  };
}

function generateEditItemData() {
  let pName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
  let aName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
  return {
    name: faker.commerce.productName(),
    type: 'Loan',
    description: faker.lorem.sentence(),
    postedBy: pName,
    acceptedBy: aName,
    status: 'On Loan'
  };
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Item API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedBlogData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function() {
    console.log('API resource before ran');
    return runServer(DATABASE_URL_TEST);
  });

  beforeEach(function() {
    console.log('API resource beforeEach ran');
    return seedItemData();
  });

  afterEach(function() {
    console.log('API resource afterEach ran');
    return tearDownDb();
  });

  after(function() {
    console.log('API resource after ran');
    return closeServer();
  });

  /**
   * This tests the GET endpoint which is the primary endpoint that will be used
   * for by users that are browsing the items list. Later the test can be expanded
   * (or more tests written) to test filtering and pagination. 
   * 
   */
  describe('GET endpoint', function() {

    it('should return all existing items posted', function() {
      let res;
      return chai.request(app)
        .get('/api/v1/items')
        .then(function(_res) {
        // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body).to.have.length.of.at.least(1); 
          return Item.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        });
    });
  });   

  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the blogpost we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new item', function() {

      const newItem= generateCreateItemData();
      return chai.request(app)
        .post('/api/v1/items')
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            '_id', 'name', 'image', 'type','description','postedBy','acceptedBy','status' );
          expect(res.body.name).to.contain(newItem.name);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.postedBy).to.equal(newItem.postedBy);
          return Item.findById(res.body.id);
        });
    });
  });

  /**
   * Test the PUT endpoint where we can return an existing item.
   * A PUT would also be used when testing the functionality users returning
   * an item.
   */
  describe('PUT endpoint', function() {
    it('should update fields you send over for return', function() {
      let pName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
      let aName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
      const updateData = {
        acceptedBy: aName,
        type: 'Loan',
        status: 'On Loan'
      }

      const newItem = generateEditItemData();
      return chai.request(app)
        .post('/api/v1/items')
        .send(newItem)
        .then(function(res) { return Item.findById(res.body.id);});

      return Item
        .findOne({status: 'On Loan'})
        .then(function(item) {
          updateData.id = item._id;  
      
      return chai.request(app)      
        .put(`/api/v1/items/return/${item._id}`)
        .send(updateData)
        .then(function(res) {
          expect(res).to.have.status(204);

      return Item.findById(updateData.id);
        })
        .then(function(item) {
          expect(item.type).to.equal(updateData.type);
          expect(item.acceptedBy).to.equal(null);
          expect(item.status).to.equal('Borrow');
        });
    });
  });
});  
  /**
   * Test the PUT endpoint where we can edit an existing item.
   * A PUT would also be used when testing the functionality users editing
   * an item.
   */
  describe('PUT endpoint', function() {
    it('should update fields you send over for edit', function() {
      let pName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
      const randomized = generateRandomTypeAndStatus();
      const updateData = {
        name: pName,
        image: faker.image.imageUrl(80, 80, 'cats'),
        type: randomized.type,
        description: faker.lorem.sentence(),
      };

      return Item
        .findOne()
        .then(function(item) {
          updateData.id = item._id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/api/v1/items/edit/${item._id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Item.findById(updateData.id);
        })
        .then(function(item) {
          expect(item.name).to.equal(updateData.name);
          expect(item.image).to.equal(updateData.image);
          expect(item.type).to.equal(updateData.type);
          expect(item.description).to.equal(updateData.description);
          expect(item.postedBy).to.not.equal(null);
          expect(item.status).to.not.equal(null);
        });
    });
  });

   /**
   * Test the PUT endpoint where we can claim an existing item.
   * A PUT would also be used when testing the functionality users claiming
   * an item.
   */
  describe('PUT endpoint', function() {
    it('should update fields you send over for claim', function() {
      let aName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
      const randomized = generateRandomTypeAndStatus();
      const updateData = {
        type: randomized.type,
        acceptedBy: aName,
        status: randomized.type,
      };

      return Item
        .findOne({status: {$nin : ["On Loan", "Purchased", "Claimed"]}})
        .then(function(item) {
          updateData.id = item._id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/api/v1/items/claim/${item._id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Item.findById(updateData.id);
        })
        .then(function(item) {
          expect(item.status).to.not.equal('Borrow');
          expect(item.status).to.not.equal('Purchase');
          expect(item.status).to.not.equal('Claim');
          expect(item.status).to.not.equal(null);
          expect(item.acceptedBy).to.equal(updateData.acceptedBy);
        });
    });
  });

  /**
   * Test the Delete endpoint to make sure that we can successfully remove
   * an item by calling the DELETE method.
   */
  describe('DELETE endpoint', function(){
    it('should delete an item', function(){
      let testItem;

      return Item
      .findOne()
      .then((item =>{
        testItem = item._id;
        return chai.request(app).delete(`/api/v1/items/${item._id}`);
      }))
      .then(res =>{
        expect(res).to.have.status(204);
      })
      .then(() =>{
        return Item.findById(testItem);
      })
      .then(res =>{
        expect(res).to.be.null;
      });
    });
  });
});

