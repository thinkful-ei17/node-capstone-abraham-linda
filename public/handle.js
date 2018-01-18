/* global $ */

'use strict';

let handle = {
  
  create: function(event) {
    event.preventDefault();
    STORE.view = 'create';
    render.view();
  },

  addItem: function(event) {
    //event.preventDefault();
    const el = $(event.target);
    const document = {
      name: el.find('.js-title').val(),
      image: el.find('.js-image').val(),
      type: el.find('.js-type').val(),
      description: el.find('.js-description').val(),
      status: el.find('.js-status').val(),
      postedBy: STORE.currentUser,
    };
  
    api.createItem(document)
    .then(()=>{
      STORE.view = 'list';
      render.view();
    })
    .catch(err => console.error(`Error: ${err.message}`));
  },

  cancelOption: function(event) {
    event.preventDefault();
    STORE.view = 'list';
    render.view();
  },

  edit: function(event){
    event.preventDefault();
    STORE.view = 'edit';
    const itemId = $(event.currentTarget).data('item-id');
    api.listItem(itemId)
    .then(res => {
      render.view(res);
    })
    .catch(err => console.error(`Error: ${err.message}`));
  },

  editItem: function(event, id){
    event.preventDefault();
    const el = $(event.target);
    const editedDocument = {
      id: id,
      name: event.target[1].value,
      image: event.target[2].value,
      type: event.target[3].value,
      description: event.target[4].value,
    };
    api.editItem(editedDocument)
    .then(res =>{
      STORE.view = 'list';
      render.view();
    })
    .catch(err => console.error(`Error: ${err.message}`));
  },

  claimItem: function(event, id, type){
    event.preventDefault();
    const el = $(event.target);
    let claimDocument;
    claimDocument = {id: id, acceptedBy: STORE.currentUser, type: type};

    api.claimItem(claimDocument)
    .then(res =>{
      STORE.view = 'list';
      render.view();
    })
    .catch(err => console.error(`Error: ${err.message}`));
  },

  delete: function(event){
    event.preventDefault();
    const itemId = $(event.currentTarget).data('item-id');
    api.delete(itemId)
    .then(() => {
      STORE.view = 'list';
      render.view();
    })
    .catch(err => console.error(`Error: ${err.message}`));
  }
};