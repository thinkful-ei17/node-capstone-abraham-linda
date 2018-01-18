// (client) app.js > user performs action (ie. click) > executes (!)handle callback
// (client) handle.js > executes (!)fetch, receives returned promise from fetch, modifies STORE (ie. STORE.view), and executes (!)render > 
// (client) fetch.js > calls server (!)router, retrieves data, and returns promise >
// (client) render.js > inject HTML
// (server) router.js > CRUD req and res > returns promise
// (BE) model.js > schema and instance method (serialize)
// (BE) primer-itemdataset.json > primer/seed data
// (FE) index.html and style.css - structure and style application

'use strict';
/**
 * Event Listener
 * Primary Job:
 * - Listen for user events like `click`, and call event handler methods
 * - Pass the "STORE" and the event objects and the event handlers
 * 
 * Setup:
 * jQuery's document ready "starts" the app
 * Event listeners are wrapped in jQuery's document.ready function
 * STORE is inside document.ready so it is protected
 * 
 * 
 * Rule of Thumb:
 * - Never manipulate DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STORE allowed
 * 
 */

//on document ready bind events
jQuery(function ($) {

  // This wires the Create "List new Item" button
  $('.js-welcome').on('click', '.create-btn', handle.create);

  // This wires the "Submit" button on the "Create" view (new item)
  $('.js-view').on('submit','form#create',event, function(e) {
    e.preventDefault();
    handle.addItem(event);
  });

  // This wires the "Cancel" button on the "Create" view
  $('.js-view').on('click', '.cancel-btn', handle.cancelOption);

  // This wires the "Edit" button on the "List" view
  $('.js-view').on('click', '.edit-btn', handle.edit);

   // This wires the "Delete" button on the "List" view
  $('.js-view').on('click', '.delete-btn', handle.delete);

  
   // This wires the "Submit" button on the "Edit" view 
  $('.js-view').on('submit','form#edit', function(e) {
    e.preventDefault();
    const itemId = $('.js-view > form#edit').data('item-id');
    handle.editItem(e, itemId);
  });

  // This wires the user-context-switching for MVP
  $('.js-mvp-user').on('change', function(e){
    STORE.currentUser = $('select option:selected').text();
    render.view();
  });

  // This wires the "Borrow", "Claim", and "Purchase" action buttons on the "List" view 
  $('.js-view').on('click','.action-btn', function(e) {
    e.preventDefault();
    const itemId = $('.action-btn').data('item-id');
    const itemType = $('.action-btn').data('item-type');
    handle.claimItem(e, itemId, itemType);
  });

}); 