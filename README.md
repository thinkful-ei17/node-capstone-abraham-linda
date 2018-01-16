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

> Note: Add Dropdown selecting populated by a STORE.users array which can be used to set STORE.currentUser and this can simulate interaction.

```js
const users = ['Alice', 'Bob','Charlie'];
store = {
  'currentUser': 'Alice A.'
}
```

- A single item object lists the poster and user who purchased/claimed item
- An endpoint should exist (or querystring) that allows for filtering 
- An endpoint should exist (or querystring) that displays the postedBy for a single user
- An endpoint should exist (or querystring) that displays the acceptedBy for a single user

## TODO

1. [x] Update User Stories
2. [x] npm init
3. [x] install packages
4. [x] create server.js
5. [x] create config.js
6. [x] .env file for environment variables
7. [x] create item folder (for feature
    - [x] model.js
    - [x] router.js
    - [x] test.js
8. [x] create public folder with client-side js
    - [x] app.js (client side js)
    - [x] fetch.js
    - [x] index.html
    - [x] style.css
    - [x] store.js 
    - [x] render.js
    - [x] handle.js
9. [x] create seed data
    {"name": "", "type": "", "description": "", "postedBy": "", "acceptedBy": "", "status": ""}
10. [x] Set-up template for HTML
11. [x] Add User Context Switcher for testing user functions.
12. [x] Add 'Create' Route for adding a new item (API)
13. [x] Add 'Update' Route for editing an existing item (API) 
14. [ ] Add 'Update/AcceptedBy' method (api)  `/api/v1/item/:id/:acceptedBy`
15. [ ] Add 'Update/Return' method (api)  `/api/v1/item/:id/?returned=true`
16. [x] Add 'Delete' Route for delete an existing item (API) `/api/v1/item/:id`
17. [x] Add View for Creation screen (Client)
18. [x] Add View for Edit screen  (Client)
19. [ ] Add "Action" button functions for "Borrow, Claim, Make Offer" ", etc (Client)
20. [ ] Fix - next is used with middleware therefore not needed; updated to have error msgs.
21. [x] Add 'Cancel' Button to 'Create' Page
22. [ ] Go through code and add error catches
23. [x] Fix mvp - user render on change
24. [x] Add 'Delete' Button to 'List' Page
25. [x] Add 'Edit' Button to 'List' Page
26. [x] Add 'Submit' Button to 'Create' Page
27. [x] Add 'Submit' Button to 'Edit' Page
28. [x] Add logic to hide button if PostedBy is equal to currentUser
29. [ ] Add logic to disable buttons for items that are 'Purchased, Claimed, or On Loan' status
30. [ ] Stretch - Add user collection and update user contextswitcher to use user db
31. [ ] more a11y friendly
32. [ ] update image to accept user image provided rather than default 
33. [ ] update and add tests!


#Pain Points
1. be cautious with referencing older code because no set pattern ex. syntax can change with different version dependencies (libraries). Ex. test -should vs. shouldOf; should vs. accept; fetch headers vs. New Headers

#Lessons Learned
1. Refer to latest documentation
2. Despite how much planning you do, stuff will still not run smoothly; however, do plan - you end up dealing with mole hill rather than a mountain.
3. Understand which database you want to work with and why one works better than another option
4. Time Management - rule of thumb: task X by Pi
5. Start out with proper understanding of MVP 

#User Stories
As a x I want to do y
1. Sign-up for access (not building out for now)
2. Log-in (not building out for now)
3. upon first loading the app, I can see Resource Sharing listing (all)
4. User - Post
    1. User has create button, once clicked, change view to post creation (input - item, description, type)
    2. User has submit button, once clicked, change view to main page, now can see new item added to top of the page
    3. New Item has Delete button and Edit button on main page (only renders, if currentUser is the same as id of person who posted)
        -forEach: render list if posted by user === current user, then you can render delete and edit button, api call to item/id with delete, api call to change view to post creation populated with posting info
    4. Based on type of item:
        1. SELL
            a. Poster - "View Offer" button - see all comments people left between indiv posters/users (future)
                - Also has "Edit" and "Delete" button
            b. Viewer - "Make Offer" button - Add 1 way comment for now
        2. LOAN 
            a. Poster - View status, no button
                 - Also has "Edit" and "Delete" button
            b. Viewer - "Borrow" button - Once clicked, tied to ID and no other user can borrow
            a/b. Both can click "Return button" which will clear out acceptedBy (null) and change status - reverts back to Loan buttons
        3. FREE   
            a. Poster - View status, no button
                - Also has "Edit" and "Delete" button
            b. Viewer - "Claim" button - Once clicked, tied to ID and no other user can claim

# LOGIC
"postedBy": 'Alice A.'
"acceptedBy": 'Charlie C.'
"type": 'Loan',
"status":'On Loan'

1. if Type = "Sell"
IF status = "Make Offer" (Available)
IF status = "Purchased" (No longer available)

2. if Type = "Free"
IF status = "Claim" (Available)
IF status = "Claimed" (no longer available)

3. If Type = "Loan"
IF status = "Borrow" (Available)
IF status = "On Loan" (no longer available)

------
For User Poster and Claimer - another button to "Return" (future build)


#PSEUDO-CODE LOGIC

To avoid postedBy and acceptedBy being the same user:
Render function use array.filter(item.postedBy !== STORE.currentUser)  >>>drives all other buttons (incl "Return", except for "Edit", "Delete"
array.filter(item.postedBy === STORE.currentUser) >>> get "Edit" and "Delete" includes "Return" button

// item object

switch(item.type){
  case "Loan":
    validStatuses = ["Borrow", "On Loan"] // renders text in button
    if item.status = "Borrow", render button
    if item.status = "On Loan", disable button
  break;
  case "Sell":
    validStatuses = ["Make Offer", "Purchased"];
    if item.status = "Make Offer", render button 
    if item.status = "Purchased" disable button
  break;
  case "Free":
    validStatuses = ["Claim","Claimed"];
    if item.status === "claim" render a button to claim 
    if item.status === "Claimed" disable button
  break;
}

renderView()

return `
<div>
if 
<button disable name=${item.status}>${item.status}</button>
</div>
`


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
+add bootstrap columns
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