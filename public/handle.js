//receives returned promises and modify STORE
/* global $, render, api */

'use strict';

// let handle = {

// };


/*

var handle = {

  search: function (event) {
    event.preventDefault();
    const store = event.data;
    const el = $(event.target);
    const title = el.find('[name=title]').val();
    var query;
    if (title) {
      query = {
        title: el.find('[name=title]').val()
      };
    }
    api.search(query)
      .then(response => {
        store.list = response;
        render.results(store);

        store.view = 'search';
        render.page(store);
      }).catch(err => {
        console.error(err);
      });
  },

  create: function (event) {
    event.preventDefault();
    const store = event.data;
    const el = $(event.target);

    const document = {
      title: el.find('[name=title]').val(),
      content: el.find('[name=content]').val(),
      author_id: el.find('[name=author]').val(),
      tags: el.find('[name=tags]').val(),
    };
    api.create(document)
      .then(response => {
        store.item = response;
        store.list = null; //invalidate cached list results
        render.detail(store);
        store.view = 'detail';
        render.page(store);
      }).catch(err => {
        console.error(err);
      });
  },

  update: function (event) {
    event.preventDefault();
    const store = event.data;
    const el = $(event.target);

    const document = {
      id: store.item.id,
      title: el.find('[name=title]').val(),
      content: el.find('[name=content]').val(),
      author_id: el.find('[name=author]').val(),
      tags: el.find('[name=tags]').val(),
    };
    api.update(document, store.token)
      .then(response => {
        store.item = response;
        store.list = null; //invalidate cached list results
        render.detail(store);
        store.view = 'detail';
        render.page(store);
      }).catch(err => {
        console.error(err);
      });
  },

  details: function (event) {
    event.preventDefault();
    const store = event.data;
    const el = $(event.target);

    const id = el.closest('li').attr('id');
    api.details(id)
      .then(response => {
        store.item = response;
        render.detail(store);

        store.view = 'detail';
        render.page(store);

      }).catch(err => {
        store.error = err;
      });
  },

  remove: function (event) {
    event.preventDefault();
    const store = event.data;
    const id = store.item.id;

    api.remove(id, store.token)
      .then(() => {
        store.list = null; //invalidate cached list results
        return handle.search(event);
      }).catch(err => {
        console.error(err);
      });
  },

  viewCreate: function (event) {
    event.preventDefault();
    const store = event.data;      

    const tagsProm = api.tags();
    const usersProm = api.users();

    const promise = Promise.all([tagsProm, usersProm]);

    promise.then(([tags, users]) => {

      store.tags = tags;
      store.users = users;

      render.create(store);
      store.view = 'create';
      render.page(store);

    }).catch(err => {
      store.error = err;
    });

  },

  viewList: function (event) {
    event.preventDefault();
    const store = event.data;
    if (!store.list) {
      handle.search(event);
      return;
    }
    store.view = 'search';
    render.page(store);
  },

  viewEdit: function (event) {
    event.preventDefault();
    const store = event.data;

    const tagsProm = api.tags();
    const usersProm = api.users();

    const promise = Promise.all([tagsProm, usersProm]);

    promise.then(([tags, users]) => {
      store.tags = tags;
      store.users = users;

      render.edit(store);
      store.view = 'edit';
      render.page(store);

    }).catch(err => {
      store.error = err;
    });

  }

};
*/