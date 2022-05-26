import request from '@/utils/request'

// token
const ConfigUri = 'v1/settings/config'
export const Config = {
  create(params) {
    return request.post(`${ConfigUri}/`, params).then(response => {
      return response
    })
  },
  update(params) {
    return request.put(`${ConfigUri}/`, params).then(response => {
      return response
    })
  },
  get() {
    return request.get(`${ConfigUri}/`).then(response => {
      return response
    })
  }
}
