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
    seedData.push(generateItemData());
  }
  // this will return a promise
  return Item.insertMany(seedData);
}


function randomize(array) {
  return array[Math.floor(Math.random()*array.length)];
}

function generateRandomTypeAndStatus(){
  const types = ['Loan','Sell','Free'];
  const loanStatuses = ['Borrow','On Loan'];
  const sellStatuses = ['Make Offer', 'Purchased'];
  const freeStatuses = ['Claim','Claimed'];

  const randomType = randomize(types);
  let randomStatus;
  switch(randomType){
  case 'Loan':
    randomStatus = randomize(loanStatuses);
    break;
  case 'Sell':
    randomStatus = randomize(sellStatuses);
    break;
  case 'Free':
    randomStatus = randomize(freeStatuses);
    break;
  }
 
  return {type: randomType, status: randomStatus};
}

// generate an object representing an item.
// can be used to generate seed data for db
// or request.body data
function generateItemData() {
  let pName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
  let aName = `${faker.name.firstName()} ${faker.name.lastName().substring(0,1)}.`;
  const randomized = generateRandomTypeAndStatus();
  const availableStatuses = ['Borrow', 'Claim', 'Make Offer'];



  return {
    name: faker.commerce.productName(),
    type: randomized.type,
    description: faker.lorem.sentence(),
    postedBy: pName,
    acceptedBy: (availableStatuses.indexOf(randomized.status) >= 0 ?  null: aName),
    status: randomized.status,
  };
}



// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }

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

  // afterEach(function() {
  //   console.log('API resource afterEach ran');
  //   return tearDownDb();
  // });

  after(function() {
    console.log('API resource after ran');
    return closeServer();
  });

  describe('GET endpoint', function() {

    it('should return all existing items posted', function() {
    //  console.log('test false ran');
    // expect(false).be.false;
    // strategy:
    //    1. get back all blogposts returned by GET request to `/posts`
    //    2. prove res has right status, data type
    //    3. prove the number of blogposts we got back is equal to number
    //       in db.
    //
    // need to have access to mutate and access `res` across
    // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/api/v1/items')
        .then(function(_res) {
        // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          console.log('what is body', res.body.length);
          expect(res.body).to.have.length.of.at.least(1); 
          return Item.count();
        })
        .then(function(count) {
          console.log(count);
          expect(res.body).to.have.lengthOf(count);
        });
    });
  }); 

}); 


    // it('should return blogposts with right fields', function() {
    //   // Strategy: Get back all blog posts, and ensure they have expected keys
    //   //console.log('test true ran');
    //   //expect(true).be.true;
    //   let resBlog;
    //   return chai.request(app)
    //     .get('/posts')
    //     .then(function(res) {
    //       expect(res).to.have.status(200);
    //       expect(res).to.be.json;
    //       expect(res.body).to.be.a('array');
    //       expect(res.body).to.have.length.of.at.least(1);

    //       res.body.forEach(function(blogpost) {
    //         expect(blogpost).to.be.a('object');
    //         expect(blogpost).to.include.keys(
    //           'id', 'author', 'title', 'content','created');
    //       });
    //       resBlog = res.body[0];
    //       return BlogPost.findById(resBlog.id);
    //     })
    //     .then(function(blogpost) {
    //       expect(resBlog.id).to.equal(blogpost.id);
    //       expect(resBlog.author).to.contain(blogpost.author.firstName);
    //       expect(resBlog.title).to.equal(blogpost.title);
    //       expect(resBlog.content).to.equal(blogpost.content); 
    //     });
    // });
  // });

  /*
  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the blogpost we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new blogpost', function() {

      const newBlogPost = generateBlogData();

      return chai.request(app)
        .post('/posts')
        .send(newBlogPost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          console.log(res.body);
          expect(res.body).to.include.keys(
            'id', 'author', 'title', 'content','created');
          expect(res.body.author).to.contain(newBlogPost.author.firstName);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.title).to.equal(newBlogPost.title);
          expect(res.body.content).to.equal(newBlogPost.content);
          return BlogPost.findById(res.body.id);
        })
        .then(function(restaurant) {
          expect(restaurant.author.firstName).to.equal(newBlogPost.author.firstName);
          expect(restaurant.author.lastName).to.equal(newBlogPost.author.lastName);
          expect(restaurant.title).to.equal(newBlogPost.title);
          expect(restaurant.content).to.equal(newBlogPost.content);
        });
    });
  });

  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing blogpost from db
    //  2. Make a PUT request to update that blogpost
    //  3. Prove posts returned by request contains data we sent
    //  4. Prove blogpost in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        title: 'Hello',
        content: 'World!'
      };

      return BlogPost
        .findOne()
        .then(function(blogpost) {
          updateData.id = blogpost.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/posts/${blogpost.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return BlogPost.findById(updateData.id);
        })
        .then(function(blogpost) {
          expect(blogpost.title).to.equal(updateData.title);
          expect(blogpost.content).to.equal(updateData.content);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('delete a post by id', function() {

      let post;

      return BlogPost
        .findOne()
        .then(function(_post) {
          post = _post;
          return chai.request(app).delete(`/posts/${post.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return BlogPost.findById(post.id);
        })
        .then(function(_post) {
          expect(_post).to.be.null;
        });
    });
  });
});
*/