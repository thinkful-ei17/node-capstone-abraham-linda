# node-capstone-abraham-linda

Questions
- best approach to start implementation 1) build working client with dummy data OR 2) build working API, then client (BACKEND FIRST!)
-keys foreign/primary join : for Mongo????? relationship - link collections with related. 
Options for relationships
1) seen - subdocuments array of objects inside user/resource object (not best for all jobs), good for user with 1-50 items, 1 to many - limit to size of single mongo object (16mb) 
FASTER
2) in between - many to many - User has array in it, in array - a bunch of ids referencing collection; instead of document on user, put reference / "array of references/ids"
3) like postgres - user associated with 1 to squillions (ex. messages, chat app), all messages have property that points to id of owner
QUANTITY

https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1


Starting Requirements
4 users 
1 - community manager (paid)
2 - resident (unpaid)
3 - resident
4 - resident


CREATE TABLE Users(
id serial primary key,
username text not null,
email text not null,
profileimage text not null,
community_id int references community(id)
)

translate this into Mongo????
Mongo structure can change - we can add communty at a later time


Mockup of what User and Resource would look like

USER
- username
- password
- firstName
- lastName

Resource
-Type (ex. FREE, LOAN, SELL)
-Name of resource
-Description
-Quantity
-



#User Story
USE MONGO for db!
Single Apt/Community - structure to support future scalability, stick to users only (CM another time)
Application/Feature: Resource Sharing (list, comment, check-in/out, )

button item check out > click > userID creates user to borrower relationship and flag for checked out status

Checkin > click userwithvalid ID > 


 until i return it or resrouce 
CRUD
MAKE SURE IT WORKS!!!!! EVERYDAY DEMOABLE

TIME MGMT:
TASK * PI
AUTHENTICATION IS A FULL DAY!

As a x I want to do y
+ Community Manager - sign up to account to manage my community
+ Community Manager - approve each resident that signs up for my community (FF)
+ Community Manager - broadcast important alerts to my community
+ Community Manager - administrator rights (FF)
+ Community Manager - approve vendors for advertising (FF)
+ Community Manager - manage rent payment transactions(FF)

+ User - sign up to account
+ User - once approved, set-up profile (face (required), name (required), aboutme, profession (optional), resource share items (optional))
+ User - HOME - sees CM alert section, access point to community board, access point to resource sharing board
+ User - accesess community board
+ User - add post to community board
+ User - delete own post on community board
+ User - see old community board posts
+ User - 


MVP
#Create a client
?

#Serve static files
+Profile image for each user (face)
+Image of resource sharing (icon)
+mock logo

#Implement REST API w/CRUD operations
+User
-New user signup - POST: /api/user
-

#Comprehensive Test for API layer

#Use Continuous Integration


Resource Sharing - Free stuff, borrowing items, rideshare (board and in user profile(future feature))
Community Message Board - general message (open to all users), ability to post, delete, update, comment
Alert Board - Broadcast message (only community manager); 



Future Features/Extension:
+ability to check-in, out, flag broken

resource

user_resource

borrower_id, resource_id, owner_id

+Community Manager - approve each resident that signs up for my community
Security - only community manager can provide final approval of new resident +access to application
Location -
+Additional Access - Guests (request parking) and Vendor Accounts +(advertisement/specials)
+Expansion - Neighborhood/Complex(!)>District>City>State
+Rent Payment (more secure than other alternatives, cost less to process?)
+Community Manager access to administrative actions (delete posts, etc.)
+User to User communication
+User to Group Selected communication
+Community Manager to User communication
+Community Manager to Group Selected communication

## Endpoints

| Method | Endpoint | Description |
|--|--|--|
| GET | /item | Lists all items |
| GET | /item/:id | Single item detail |
| POST| /item | Creates a new item |
| PUT | /item | Updates an item |
| DELETE | /item/:id | Deletes an item |

## Mock Objects

```js
item = {
"name":'Lawn Mower',
"image":'img.jpg',
"type": 'Loan',
"description":'Brand new Lawn mower sitting in my garage collecting dust. Now that I have astro-truf. Go ahead and borrow it if you need it! - Alice',
"postedBy": 'Alice A.'
"acceptedBy": 'Charlie C.'
"status":'On Loan'
};
```

## TODO

- A single item object lists the poster and user who purchased/claimed item
- An endpoint should exist (or querystring) that allows for filtering 
- An endpoint should exist (or querystring) that displays the postedBy for a single user
- An endpoint should exist (or querystring) that displays the acceptedBy for a single user