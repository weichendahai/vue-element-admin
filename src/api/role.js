import fetch from 'utils/fetch';

export function fetchList() {
  return fetch({
    url: '/api/role/list',
    method: 'get'
  });
}

export function insertRole(data) {
  return fetch({
    url: '/api/role/insert',
    method: 'post',
    data,
  });
}

export function deleteRole(data) {
  return fetch({
    url: '/api/role/delete',
    method: 'post',
    data,
  });
}

export function updateRole(data) {
  return fetch({
    url: '/api/role/update',
    method: 'post',
    data,
    // headers: {
    //   'Content-type': 'application/x-www-form-urlencoded'
    // }
  });
}
