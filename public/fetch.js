'use strict';

/**
 * API: DATA ACCESS LAYER (using fetch())
 * 
 * Primary Job: communicates with API methods. 
 *  
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - No jquery on this page, use `fetch()` not `$.AJAX()` or `$.getJSON()`
 * - Do not call render methods from this layer
 * 
 */

function buildUrl(path, query) {
  var url = new URL(path, window.location.origin);
  if (query) {
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  }
  return url;
}

function normalizeResponseErrors(res) {
  if (!res.ok) {
    if (
      res.headers.has('content-type') &&
      res.headers.get('content-type').startsWith('application/json')
    ) {
      // It's a nice JSON error returned by us, so decode it
      return res.json().then(err => Promise.reject(err));
    }
    // It's a less informative error returned by express
    return Promise.reject({
      status: res.status,
      message: res.statusText
    });
  }
  return res;
}

let api = {

  welcome: function () {
    const url = buildUrl('/api/v1');
    return fetch(url, {
      method: 'GET', 
      headers: {
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },

  listUsers: function(){
    // This may be replaced with a users db collection if time permits
    const users  = ['Alice A.', 'Bob B.', 'Charlie C.', 'David D.'];
    return users;
  },

  listItems: function () {
    const url = buildUrl('/api/v1/items');
    return fetch(url, {
      method: 'GET', 
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(normalizeResponseErrors)
    .then(res => res.json())
    .catch(err => console.error(err.message));
  },
  
  listItem: function(id){
    const url = buildUrl(`/api/v1/items/${id}`);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(normalizeResponseErrors)
    .then(res => res.json())
    .catch(err => console.error(err.message));
  },

  createItem: function(newItem) {
    const url = buildUrl('/api/v1/items');
    return fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(newItem),
    })
    .then(normalizeResponseErrors)
    .then(res => res.json())
    .catch(err => {
      console.error(`Error: ${err.message}`);
    });
  },

  editItem: function(editedDocument) {
    const url = buildUrl(`/api/v1/items/${editedDocument.id}`);
    return fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(editedDocument),
    })
    .then(normalizeResponseErrors)
    .catch(err => {
      console.error(`Error: ${err.message}`);
    });
  },

  claimItem: function(claimDocument) {
    const url = buildUrl(`/api/v1/items/${claimDocument.id}/${claimDocument.acceptedBy}`);
    return fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(claimDocument),
    })
    .then(normalizeResponseErrors)
    .catch(err => {
      console.error(`Error: ${err.message}`);
    });
  },

  returnItem: function(returnDocument) {
    const url = buildUrl(`/api/v1/items/${returnDocument.id}`);
    return fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(returnDocument),
    })
    .then(normalizeResponseErrors)
    .catch(err => {
      console.error(`Error: ${err.message}`);
    });
  },

  delete: function(id){
    const url = buildUrl(`/api/v1/items/${id}`);
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(normalizeResponseErrors)
    .catch(err => {
      console.error(`Error: ${err.message}`);
    });
  }
};  