/* global $, demo */

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

var render = {

  view: function() {
    if(STORE.view === 'list') {
      api.listItems().then(response => this.listItems(response));
    }
    if(STORE.view === 'create') {
      this.createItem();
    }
    // if(STORE.view === 'edit') {

    // }
    // if(STORE.view === 'delete') {

    // }
  },

  welcome: function (response) {
    const message = response.message;
    const createItemButton =  '<button type="button" class="create-btn">List New Item</button>';
    $('.js-welcome').html(message).append(createItemButton);
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
        <img src="http://lorempixel.com/80/80/cats" alt="${item.name}">
        <h2>${item.name}</h2>
        <em>Type: ${item.type}</em>
        <p>${item.description}</p>
        </div>
        <div class="actions">
        <p>Posted By: ${item.postedBy}</p>
        ${(item.acceptedBy ? item.status+' '+item.acceptedBy : '')}
        <button type="button" class="action-btn ${item.status.replace(' ','-')}">${item.status}</button>
        </div>
      </div>
      `;
    }
    ); 
  $('.js-view').html(item);
  },

  createItem: function() {
    const templateCreate = `
    <form id="create" class="js-view-form form-group">
      <fieldset>
      <legend>Create</legend>
      <div>
        <label for="name">Item Title</label>
        <input type="text" class="js-title form-control" name="name">
      </div>
      <div>
        <label for="image">Item Image</label>
        <input type="text" class="js-image form-control" name="image">
      </div>
      <div>
        <label for="type">Type</label>
        <input type="text" class="js-type form-control" name="type">
      </div>
      <div>
        <label for="description">Item Description</label>
        <textarea rows="4" cols="50" name="description"  class="js-description form-control"></textarea>

      </div>
      <div>
        <label for="status">Item Status</label>
        <input type="text" class="js-status form-control" name="status">
      </div>
      <button type="submit" class="btn-primary btn submit-btn">Submit</button>
      </fieldset>
      </form>
    `;
    $('.js-view').html(templateCreate);
  }
  ,

  // updateItem: function(item) {
  //   return `
  //   <div class="listing">
  //     <div class="item-info">
  //     <img src="http://lorempixel.com/80/80/cats" alt="${item.name}">
  //     <h2>${item.name}</h2>
  //     <em>Type: ${item.type}</em>
  //     <p>${item.description}</p>
  //     </div>
  //     <div class="actions">
  //     <p>Posted By: ${item.postedBy}</p>
  //     ${(item.acceptedBy ? item.status+' '+item.acceptedBy : '')}
  //     <button type="button" class="action-btn ${item.status.replace(' ','-')}">${item.status}</button>
  //     </div>
  //   </div>
  //   `;
  // }


  
};

$(() =>{
  // Do stuff here e.g. call api.welcome()
  api.welcome().then(response => render.welcome(response));
  api.listUsers();
  render.userContextSwitcher();
  render.view();
});



/*

var render = {

  page: function (store) {
    if (demo) {
      $('.view').css('background-color', 'gray');
      $('#' + store.view).css('background-color', 'white');
    } else {
      $('.view').hide();
      $('#' + store.view).show();
    }
  },

  results: function (store) {
    const listItems = store.list.map((item) => {
      let tags = [];
      if (item.tags) {
        tags = item.tags.map(tag => {
          return `<li>${tag.name}</li>`;
        });
      }

      return `<li id="${item.id}">
                <a href="${item.url}" class="detail">${item.title}</a> <span>by: ${item.author}</span>
                <ul class="tags">Tags: ${tags.length?tags.join(''):'None'}</ul>
              </li>`;
    });
    $('#result').empty().append('<ul>').find('ul').append(listItems);
  },

  edit: function (store) {
    const el = $('#edit');
    const item = store.item;
    const userOptions = store.users.map((user) => {
      return `<option value="${user.id}">${user.username}</option>`;
    });
    el.find('select[name=author]').empty().append('<option>Select an Author</option>').append(userOptions);

    let tagOptions = [];
    if (store.tags.length) {
      tagOptions = store.tags.map((tag) => {
        return `<option value="${tag.id}">${tag.name}</option>`;
      });
      el.find('select[name=tags]').empty().append(tagOptions);
    }

    let selectedTags = [];
    if (store.tags && item.tags) {
      selectedTags = item.tags.map(tag => tag.id);
      el.find('select[name=tags]').val(selectedTags);
    }

    el.find('[name=title]').val(item.title);
    el.find('[name=author]').val(item.authorId);
    el.find('[name=content]').val(item.content);

  },

  detail: function (store) {
    const el = $('#detail');
    const item = store.item;
    el.find('.title').text(item.title);
    el.find('.author').text(item.author);

    let tags = [];
    if (item.tags) {
      tags = item.tags.map(tag => {
        return `<li>${tag.name}</li>`;
      });
    }
    if (tags.length) {
      el.find('.tags').empty().append('<ul>').find('ul').append(tags);
    }
    el.find('.content').text(item.content);
  },

  create: function (store) {
    const el = $('#create');
    const userOptions = store.users.map((user) => {
      return `<option value="${user.id}">${user.username}</option>`;
    });
    el.find('select[name=author]').empty().append('<option>Select an Author</option>').append(userOptions);

    let tagOptions = [];
    if (store.tags.length) {
      tagOptions = store.tags.map((tag) => {
        return `<option value="${tag.id}">${tag.name}</option>`;
      });
      el.find('select[name=tags]').empty().append(tagOptions);
    }

  }

};
*/