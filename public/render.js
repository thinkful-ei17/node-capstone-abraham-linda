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

  welcome: function (response) {
    const message = response.message;
    $('.js-welcome').html(message);
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
        <button type="button" class="action ${item.status.replace(' ','-')}">${item.status}</button>
        </div>
      </div>
      `;
    }
    ); 
    $('.js-listitems').html(item);
  }
};

$(() =>{
  // Do stuff here e.g. call api.welcome()
  api.welcome().then(response => render.welcome(response));
  api.listItems().then(response => render.listItems(response));
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