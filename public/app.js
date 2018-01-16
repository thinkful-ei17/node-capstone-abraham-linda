// run handle > executes fetch > returns to STORE > then we render based on STORE (view and user)

/* global jQuery, handle, render */
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
 * - Never manipulation DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STORE allowed
 * 
 */

//on document ready bind events
jQuery(function ($) {

  // This wires the Create "List new Item" button
  $('.js-welcome').on('click', '.create-btn', handle.create);

  // This handles the submit of the create 
  $('.js-view').on('submit','form#create',event, function(e) {
    console.log('Create Submit button clicked!!!');
    e.preventDefault();
    handle.addItem(event);
  });

  // This handles cancel button in create
  $('.js-view').on('click', '.cancel-btn', handle.cancelOption);

  $('.js-view').on('click', '.edit-btn', handle.edit);
  
   // This handles the submit of the create 
  $('.js-view').on('submit','form#edit', event, function(e) {
    e.preventDefault();
    const itemId = $(event.currentTarget).data('item-id');
    console.log('I am the lost itemId', itemId);
    handle.editItem(event, itemId);
  });

  // This handles user-context-switching in mvp
  $('.js-mvp-user').on('change', function(e){
    STORE.currentUser = $('select option:selected').text();
  });

});

// function handleShoppingListAdd() {

//   $('#js-shopping-list-form').submit(function(e) {
//     e.preventDefault();
//     addShoppingItem({
//       name: $(e.currentTarget).find('#js-new-item').val(),
//       checked: false
//     });
//   });

// }


  /*
  $('#create').on('submit', STORE, handle.create);
  $('#search').on('submit', STORE, handle.search);
  $('#edit').on('submit', STORE, handle.update);

  $('#result').on('click', '.detail', STORE, handle.details);
  $('#detail').on('click', '.remove', STORE, handle.remove);
  $('#detail').on('click', '.edit', STORE, handle.viewEdit);
  
  $(document).on('click', '.viewCreate', STORE, handle.viewCreate);
  $(document).on('click', '.viewList', STORE, handle.viewList);

  // start app by triggering a search
  $('#search').trigger('submit');

});
*/