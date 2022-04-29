import request from '@/utils/request'

const RoleURI = 'v1/prem/role'
export const Role = {
  create(params) {
    return request.post(`${RoleURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${RoleURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${RoleURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${RoleURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${RoleURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${RoleURI}/`, { params: params }).then(response => {
      return response
    })
  },
  bind_user(params) {
    return request.post(`${RoleURI}/bind-user/`, params).then(response => {
      return response
    })
  },
  un_bind(params) {
    return request.post(`${RoleURI}/unbind-user/`, params).then(response => {
      return response
    })
  }
}

const RuleURI = 'v1/prem/rule'
export const Rule = {
  create(params) {
    return request.post(`${RuleURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${RuleURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${RuleURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${RuleURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${RuleURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${RuleURI}/`, { params: params }).then(response => {
      return response
    })
  }

}

const classifyURI = 'v1/prem/classify'
export const Classify = {
  create(params) {
    return request.post(`${classifyURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${classifyURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${classifyURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${classifyURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${classifyURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${classifyURI}/`, { params: params }).then(response => {
      return response
    })
  }

}
