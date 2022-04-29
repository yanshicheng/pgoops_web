import request from '@/utils/request'

// 角色相关
const ROLEURI = 'v1/prem/role'
export const PremRole = {
  create(params) {
    return request.post(`${ROLEURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${ROLEURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${ROLEURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${ROLEURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${ROLEURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${ROLEURI}/`, { params: params }).then(response => {
      return response
    })
  },
  parent() {
    return request.get(`${ROLEURI}/parent/`).then(response => {
      return response
    })
  }
}

// 角色相关
const MENUURI = 'v1/prem/menu'
export const PremMenu = {
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
  parent() {
    return request.get(`${MENUURI}/parent/`).then(response => {
      return response
    })
  },
  tree() {
    return request.get(`${MENUURI}/tree/`).then(response => {
      return response
    })
  }
}

// 角色相关
const RULEURI = 'v1/prem/rule'
export const PremRule = {
  create(params) {
    return request.post(`${RULEURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${RULEURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${RULEURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${RULEURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${RULEURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${RULEURI}/`, { params: params }).then(response => {
      return response
    })
  },
  tree() {
    return request.get(`${RULEURI}/tree/`).then(response => {
      return response
    })
  },
  parent(params) {
    return request.get(`${RULEURI}/parent/`, { params: params }).then(response => {
      return response
    })
  }
}
//
// const RuleClassify = 'v1/prem/rule-classify'
// export const PremRuleClassify = {
//   create(params) {
//     return request.post(`${RuleClassify}/`, params).then(response => {
//       return response
//     })
//   },
//   delete(id) {
//     return request.delete(`${RuleClassify}/${id}/`)
//   },
//   update(id, params) {
//     return request.put(`${RuleClassify}/${id}/`, params).then(response => {
//       return response
//     })
//   },
//   patch(id, params) {
//     return request.patch(`${RuleClassify}/${id}/`, params).then(response => {
//       return response
//     })
//   },
//   get(id) {
//     return request.get(`${RuleClassify}/${id}/`).then(response => {
//       return response
//     })
//   },
//   list(params) {
//     return request.get(`${RuleClassify}/`, {params: params}).then(response => {
//       return response
//     })
//   },
//   tree() {
//     return request.get(`${RuleClassify}/tree/`).then(response => {
//       return response
//     })
//   }
// }
