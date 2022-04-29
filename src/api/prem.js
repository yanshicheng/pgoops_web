import request from '@/utils/request'

const MENUURI = 'v1/prem/menu'
export const Menu = {
  create(params) {
    return request.post(`${MENUURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${MENUURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${MENUURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${MENUURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${MENUURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${MENUURI}/`, { params: params }).then(response => {
      return response
    })
  },
  tree() {
    return request.get(`${MENUURI}/tree/`).then(response => {
      return response
    })
  }
}
