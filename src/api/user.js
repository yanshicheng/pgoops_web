import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/user/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/v1/user/info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/v1/user/logout/',
    method: 'post'
  })
}

// 类型相关
const USERINFO = 'v1/user/user-profile'
export const UserInfoO = {
  create(params) {
    return request.post(`${USERINFO}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${USERINFO}/${id}/`)
  },
  update(id, params) {
    return request.put(`${USERINFO}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${USERINFO}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${USERINFO}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${USERINFO}/`, { params: params }).then(response => {
      return response
    })
  },
  repwd(id, params) {
    return request.put(`${USERINFO}/${id}/reset-password/`, params).then(response => {
      return response
    })
  },
  change_password(id, params) {
    return request.put(`${USERINFO}/${id}/change-password/`, params).then(response => {
      return response
    })
  }
}

const department = 'v1/user/department'
export const Department = {
  create(params) {
    return request.post(`${department}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${department}/${id}/`)
  },
  update(id, params) {
    return request.put(`${department}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${department}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${department}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${department}/`, { params: params }).then(response => {
      return response
    })
  }
}
