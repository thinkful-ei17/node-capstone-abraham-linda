// run handle > executes fetch > returns to STORE > then we render based on STORE (view and user)

/* global jQuery, handle */
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

  const STORE = {
    view: 'list',       // current view: list | details | create | edit 
    currentUser: 'Alice A.',          //current user account
  };


  //$('').on('', STORE, handle.);

});


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