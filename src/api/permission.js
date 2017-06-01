import fetch from 'utils/fetch';

export function fetchList() {
  return fetch({
    url: '/api/permission/list',
    method: 'get'
  });
}

export function insert(data) {
  return fetch({
    url: '/api/permission/insert',
    method: 'post',
    data,
  });
}

export function deleteP(data) {
  return fetch({
    url: '/api/permission/delete',
    method: 'post',
    data,
  });
}

export function update(data) {
  return fetch({
    url: '/api/permission/update',
    method: 'post',
    data,
    // headers: {
    //   'Content-type': 'application/x-www-form-urlencoded'
    // }
  });
}
