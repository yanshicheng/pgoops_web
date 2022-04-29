import request from '@/utils/request'

// token
const AlertHostUri = 'v1/alert/host'
export const AlertHost = {
  create(params) {
    return request.post(`${AlertHostUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${AlertHostUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${AlertHostUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${AlertHostUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${AlertHostUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${AlertHostUri}/`, { params: params }).then(response => {
      return response
    })
  },
  forbidden(id) {
    return request.post(`${AlertHostUri}/${id}/forbidden/`).then(response => {
      return response
    })
  },
  resume(id) {
    return request.post(`${AlertHostUri}/${id}/resume/`).then(response => {
      return response
    })
  }
}

const AlertHistoryUri = 'v1/alert/history'
export const AlertHistory = {
  delete(id) {
    return request.delete(`${AlertHistoryUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${AlertHistoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${AlertHistoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${AlertHistoryUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${AlertHistoryUri}/`, { params: params }).then(response => {
      return response
    })
  },
  deldata(params) {
    return request.post(`${AlertHistoryUri}/deldata/`, params).then(response => {
      return response
    })
  }
}
