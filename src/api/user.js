import fetch from 'utils/fetch';

export function fetchList() {
  return fetch({
    url: '/api/user/list',
    method: 'get'
  });
}

export function insertUser(data) {
  return fetch({
    url: '/api/user/insert',
    method: 'post',
    data,
  });
}

export function deleteUser(data) {
  return fetch({
    url: '/api/user/delete',
    method: 'post',
    data,
  });
}

export function updateUser(data) {
  return fetch({
    url: '/api/user/update',
    method: 'post',
    data,
    // headers: {
    //   'Content-type': 'application/x-www-form-urlencoded'
    // }
  });
}

// export function insert(
//       loginname,
//       password,
//       email,
//       type,
//       status,
//       createTime,
//       lastTime) {
//   const data = {
//       loginname,
//       password,
//       email,
//       type,
//       status,
//       createTime,
//       lastTime
//   }
//
//   console.log(data);
//   console.log("x=========== =====x");
//   // return;
//   return fetch({
//     url: '/api/user/insert',
//     method: 'post',
//     data
//   });
// }

// export function insert(name) {
//   return fetch({
//     url: '/api/user/insert',
//     method: 'get',
//     params: { name }
//   });
// }
