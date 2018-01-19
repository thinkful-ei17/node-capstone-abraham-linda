/* global $ */

'use strict';
/**
 * RENDER METHODS
 * 
 * Primary Job: Direct DOM Manipulation
 * 
 * Rule of Thumb:
 * - Direct DOM manipulation OK
 * - Never update store
 * 
 */

let render = {

  view: function(id=null) {

    if(STORE.view === 'login'){
      this.login(); 
    }

    if(STORE.view === 'list') {
      api.listItems().then(response => this.listItems(response));
    }
    if(STORE.view === 'create') {
      this.createItem();
    }
    if(STORE.view === 'edit') {
      this.editItem(id);
    }
  },

  welcome: function (response) {
    const message = response.message;
    const createItemButton =  '<button type="button" class="create-btn">List New Item</button>';
    $('.js-welcome').html(message).append(createItemButton);
  },

  login: function(){
    const loginHtml=`
    <div class="login-box">
              <h1>Login</h1>
              <p>Sign In to your account</p>
                <label for="username"></label>
                <input type="text" placeholder="Username" name="username">
                <label for="password"></label>
                <input type="password" name="password" placeholder="Password">
                  <button type="button" class="js-login">Login</button>
                  <button type="button" class="js-forgot-pw">Forgot password?</button>
            </div>
          </div>
                <h2>Sign up</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <button type="button">Register Now!</button>
        </div>
    `;
    $('.js-welcome').html(loginHtml);
  },

  userContextSwitcher: function(){
    // Get array from api.listUsers
    const usersList = api.listUsers();
    // format user from usersList to option tag
    const userOptions = usersList.map(user => {
      return `<option>${user}</option>`;
    });

   //append userOptions to select element
    let selectEl = '<select class="user">';
    userOptions.forEach(u => selectEl += u);
    selectEl += '</select>';

    // inject select element to div
    $('.js-mvp-user').html(selectEl);
  },
  
  listItems: function (items) {
    const item = items.map(item => {
      return `
      <div class="listing">
        <div class="item-info">
        <img src="${(item.image ? item.image : '//lorempixel.com/80/80/cats')}" alt="${item.name}">
        <h2>${item.name}</h2>
        <em>Type: ${item.type}</em>
        <p>${item.description}</p>
        </div>
        <div class="actions">
        <p>Posted by: ${item.postedBy}</p>
        <p>${(item.acceptedBy ? item.status+' by: '+item.acceptedBy : '')}</p>
        ${(((item.status === 'Borrow' || item.status === 'Claim' || item.status === 'Make Offer') && (item.postedBy !== STORE.currentUser)) ? `<button type="button" data-item-id="${item._id}" data-item-type="${item.type}" class="action-btn btn ${item.status.replace(' ','-')}">${item.status}</button>` : '')}
        ${((item.status === 'On Loan' || item.status === 'Claimed' || item.status === 'Purchased') ? `<div class="js-status-tag"> ${item.status} </div>`: '')}
        ${(item.postedBy === STORE.currentUser ? `<button type="button" data-item-id="${item._id}" class="btn btn-info edit-btn">Edit</button>`:'')}
        ${(item.postedBy === STORE.currentUser ? `<button type="button" data-item-id="${item._id}" class="btn btn-danger delete-btn">Delete</button>`:'')}
        
        </div>
      </div>
      `;
    }); 
    $('.js-view').html(item);
  },

  _renderForm: function(className, id = null){
    /**
     * These should come from a possible endpoint listing valid combinations
     * of 
     */
    const typeList = ['Sell', 'Loan', 'Free']; 

    let templateCreate = `<form id="${className}" `;
    
    templateCreate += (id ? `data-item-id=${id}`:'');
    
    templateCreate+=` class="js-view-form form-group">
      <fieldset>
      <legend>${className[0].toUpperCase()+className.substring(1)}</legend>
      <div>
        <label for="name">Item Title</label>
        <input type="text" class="js-title form-control" name="name" required>
      </div>
      <div>
        <label for="image">Item Image</label>
        <input type="text" class="js-image form-control" name="image" placeholder="e.g. http://lorempixel.com/80/80/cat">
      </div>
      <div>
        <label for="type">Type</label>
        <select class="form-control js-type" name="type">`;
        
    typeList.forEach(t =>{
      templateCreate+=`<option value="${t}">${t}</option>`;
    });

    templateCreate+=`</select>
      </div>
      <div>
        <label for="description">Item Description</label>
        <textarea rows="4" cols="50" name="description"  class="js-description form-control"></textarea>

      </div>
      <button type="submit" class="btn-primary btn submit-${className}-btn">Submit</button>
      <button type="cancel" class="btn-outline-warning btn cancel-btn">Cancel</button>
      </fieldset>
      </form>
    `;
    return templateCreate;
  },

  createItem: function() {
    const createTemplate = this._renderForm('create');
    $('.js-view').html(createTemplate);
  },

  editItem: function(item) {
    const editTemplate = this._renderForm('edit', item._id);

    $('.js-view').html(editTemplate);
    $('.js-view > form#edit').find('.js-title').val(item.name);
    $('.js-view > form#edit').find('.js-image').val(item.image);
    $('.js-view > form#edit .js-type option[value='+item.type+']').attr('selected', 'true');
    $('.js-view > form#edit').find('.js-description').val(item.description);
  },

  claimItem: function(item) {
    const createTemplate = this._renderForm('create');
    $('.js-view').html(createTemplate);
  },
  
};

function renderInit(){
  
  render.view();
}

// $(() =>{
//   // Do stuff here e.g. call api.welcome()
//   api.welcome().then(response => render.welcome(response));
//   api.listUsers();
//   render.userContextSwitcher();
//   render.view();
// });