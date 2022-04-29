import request from '@/utils/request'

// 服务树相关接口
const TreeURI = 'v1/service-tree/nodes'
export const ServiceTree = {
  create(params) {
    return request.post(`${TreeURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TreeURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TreeURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TreeURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TreeURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TreeURI}/`, { params: params }).then(response => {
      return response
    })
  },
  detail(id, params) {
    return request.get(`${TreeURI}/${id}/server/`, { params: params }).then(response => {
      return response
    })
  },
  getperm(id, params) {
    return request.get(`${TreeURI}/${id}/opera-permission-member/`, { params: params }).then(response => {
      return response
    })
  },
  gettag(id, params) {
    return request.get(`${TreeURI}/${id}/tag/`, { params: params }).then(response => {
      return response
    })
  }
}

const PERMURI = 'v1/service-tree/opera-permission'
export const ServiceTreePerm = {
  create(params) {
    return request.post(`${PERMURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${PERMURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${PERMURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${PERMURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${PERMURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${PERMURI}/`, { params: params }).then(response => {
      return response
    })
  },
  detail(id, params) {
    return request.get(`${PERMURI}/${id}/server/`, { params: params }).then(response => {
      return response
    })
  },
  parent(params) {
    return request.get(`${PERMURI}/parent/`, { params: params }).then(response => {
      return response
    })
  }
}

const TAGURI = 'v1/service-tree/tag'
export const ServiceTreeTag = {
  create(params) {
    return request.post(`${TAGURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TAGURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TAGURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TAGURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TAGURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TAGURI}/`, { params: params }).then(response => {
      return response
    })
  },
  detail(id, params) {
    return request.get(`${TAGURI}/${id}/server/`, { params: params }).then(response => {
      return response
    })
  },
  parent(params) {
    return request.get(`${TAGURI}/parent/`, { params: params }).then(response => {
      return response
    })
  }
}

// 服务树相关接口
const NodeClassify = 'v1/service-tree/node-link-classify'
export const STNodeClassify = {
  create(params) {
    return request.post(`${NodeClassify}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${NodeClassify}/${id}/`)
  },
  update(id, params) {
    return request.put(`${NodeClassify}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${NodeClassify}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${NodeClassify}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${NodeClassify}/`, { params: params }).then(response => {
      return response
    })
  },
  detail(id, params) {
    return request.get(`${NodeClassify}/${id}/server/`, { params: params }).then(response => {
      return response
    })
  },
  getperm(id, params) {
    return request.get(`${NodeClassify}/${id}/opera-permission-member/`, { params: params }).then(response => {
      return response
    })
  },
  gettag(id, params) {
    return request.get(`${NodeClassify}/${id}/tag/`, { params: params }).then(response => {
      return response
    })
  }
}

// 服务树相关接口
const NodeAsset = 'v1/service-tree/node-link-asset'
export const STNodeAsset = {
  create(params) {
    return request.post(`${NodeAsset}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${NodeAsset}/${id}/`)
  },
  update(id, params) {
    return request.put(`${NodeAsset}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${NodeAsset}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${NodeAsset}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${NodeAsset}/`, { params: params }).then(response => {
      return response
    })
  },
  detail(id, params) {
    return request.get(`${NodeAsset}/${id}/server/`, { params: params }).then(response => {
      return response
    })
  },
  getperm(id, params) {
    return request.get(`${NodeAsset}/${id}/opera-permission-member/`, { params: params }).then(response => {
      return response
    })
  },
  gettag(id, params) {
    return request.get(`${NodeAsset}/${id}/tag/`, { params: params }).then(response => {
      return response
    })
  }
}
