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
  renderInit();
  handlersInit();
}); 