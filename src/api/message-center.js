import request from '@/utils/request'

// token
const ProviderUri = 'v1/message-center/provider'
export const Provider = {
  create(params) {
    return request.post(`${ProviderUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${ProviderUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${ProviderUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${ProviderUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${ProviderUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${ProviderUri}/`, { params: params }).then(response => {
      return response
    })
  }
}

const GroupUri = 'v1/message-center/group'
export const Group = {
  create(params) {
    return request.post(`${GroupUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${GroupUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${GroupUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${GroupUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${GroupUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${GroupUri}/`, { params: params }).then(response => {
      return response
    })
  }
}

const LevelUri = 'v1/message-center/level'
export const Level = {
  create(params) {
    return request.post(`${LevelUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${LevelUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${LevelUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${LevelUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${LevelUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${LevelUri}/`, { params: params }).then(response => {
      return response
    })
  }
}

const HistoryUri = 'v1/message-center/history'
export const History = {
  create(params) {
    return request.post(`${HistoryUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${HistoryUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${HistoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${HistoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${HistoryUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${HistoryUri}/`, { params: params }).then(response => {
      return response
    })
  },
  test(params) {
    return request.post(`${HistoryUri}/test/`, params).then(response => {
      return response
    })
  }
}
