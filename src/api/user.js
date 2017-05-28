import fetch from 'utils/fetch';

export function getList() {
  return fetch({
    url: '/api/user/list',
    method: 'get'
  });
}
