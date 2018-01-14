//call backend server, fetch data and return promise

'use strict';

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

var api = {

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

  listItems: function () {
    const url = buildUrl('/api/v1/items');
    return fetch(url, {
      method: 'GET', 
      headers: {
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  }

};   


// /**
//  * API: DATA ACCESS LAYER (using fetch())
//  * 
//  * Primary Job: communicates with API methods. 
//  *  
//  * Rule of Thumb:
//  * - Never manipulation DOM directly
//  * - No jquery on this page, use `fetch()` not `$.AJAX()` or `$.getJSON()`
//  * - Do not call render methods from this layer
//  * 
//  */

// function buildUrl(path, query) {
//   var url = new URL(path, window.location.origin);
//   if (query) {
//     Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
//   }
//   return url;
// }

// function normalizeResponseErrors(res) {
//   if (!res.ok) {
//     if (
//       res.headers.has('content-type') &&
//       res.headers.get('content-type').startsWith('application/json')
//     ) {
//       // It's a nice JSON error returned by us, so decode it
//       return res.json().then(err => Promise.reject(err));
//     }
//     // It's a less informative error returned by express
//     return Promise.reject({
//       status: res.status,
//       message: res.statusText
//     });
//   }
//   return res;
// }

// var api = {

//   search: function (query) {
//     const url = buildUrl(ITEMS_URL, query);

//     return fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json'
//       }
//     }).then(normalizeResponseErrors)
//       .then(res => res.json());
//   },

//   details: function (id) {
//     const url = buildUrl(`${ITEMS_URL}/${id}`);

//     return fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json'
//       }
//     }).then(normalizeResponseErrors)
//       .then(res => res.json());
//   },

//   create: function (document) {
//     const url = buildUrl(`${ITEMS_URL}`);

//     return fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: document ? JSON.stringify(document) : null
//     }).then(normalizeResponseErrors)
//       .then(res => res.json());
//   },

//   update: function (document) {
//     const url = buildUrl(`${ITEMS_URL}/${document.id}`);

//     return fetch(url, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: document ? JSON.stringify(document) : null
//     }).then(normalizeResponseErrors)
//       .then(res => res.json());
//   },

//   remove: function (id) {
//     const url = buildUrl(`${ITEMS_URL}/${id}`);

//     return fetch(url, {
//       method: 'DELETE',
//       headers: {
//         'Accept': 'application/json'
//       }
//     }).then(normalizeResponseErrors)
//       .then(res => res.text());
//   },

//   users: function () {
//     const url = buildUrl(USERS_URL);

//     return fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json'
//       }
//     }).then(normalizeResponseErrors)
//       .then(res => res.json());
//   },

//   tags: function () {
//     const url = buildUrl(TAGS_URL);

//     return fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json'
//       }
//     })
//       .then(normalizeResponseErrors)
//       .then(res => res.json())
//       .catch(() => []);
//   }

// };


