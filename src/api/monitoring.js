import request from '@/utils/request'

// token
const ProviderUri = 'v1/openapi/test'
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
  get(id, params) {
    return request.get(`${ProviderUri}/${id}/`, { params: params }).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${ProviderUri}/`, { params: params }).then(response => {
      return response
    })
  }
}

const NodeUri = 'v1/monitor/node'
export const Node = {
  create(params) {
    return request.post(`${NodeUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${NodeUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${NodeUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${NodeUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id, params) {
    return request.get(`${NodeUri}/${id}/`, { params: params }).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${NodeUri}/`, { params: params }).then(response => {
      return response
    })
  },
  classify(params) {
    return request.get(`${ApplicationUri}/data-map-classify/`, { params: params }).then(response => {
      return response
    })
  },
  download_config(id, params) {
    return request.post(`${NodeUri}/${id}/download-config/`, params).then(response => {
      return response
    })
  },
  distribute_config(params) {
    return request.post(`${NodeUri}/distribute-config/`, params).then(response => {
      return response
    })
  }
}

const GroupUri = 'v1/monitor/group'
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
  get(id, params) {
    return request.get(`${GroupUri}/${id}/`, { params: params }).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${GroupUri}/`, { params: params }).then(response => {
      return response
    })
  },
  group_rules(id, params) {
    return request.get(`${GroupUri}/${id}/group-rules/`, { params: params }).then(response => {
      return response
    })
  },
  group_rules_all(params) {
    return request.get(`${GroupUri}/group-rules/`, { params: params }).then(response => {
      return response
    })
  },
  distribute_config(params) {
    return request.post(`${GroupUri}/distribute-config/`, params).then(response => {
      return response
    })
  }
}

const ApplicationUri = 'v1/monitor/application'
export const Application = {
  create(params) {
    return request.post(`${ApplicationUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${ApplicationUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${ApplicationUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${ApplicationUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id, params) {
    return request.get(`${ApplicationUri}/${id}/`, { params: params }).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${ApplicationUri}/`, { params: params }).then(response => {
      return response
    })
  },
  classify(params) {
    return request.get(`${ApplicationUri}/data-map-classify/`, { params: params }).then(response => {
      return response
    })
  },
  monitor(id, params) {
    return request.get(`${ApplicationUri}/${id}/monitor/`, { params: params }).then(response => {
      return response
    })
  },
  consul(params) {
    return request.post(`${ApplicationUri}/consul/`, params).then(response => {
      return response
    })
  },
  service_monitor(params) {
    return request.get(`${ApplicationUri}/service-monitor/`, { params: params }).then(response => {
      return response
    })
  }
}

const RulesUri = 'v1/monitor/rules'
export const Rules = {
  create(params) {
    return request.post(`${RulesUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${RulesUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${RulesUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${RulesUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id, params) {
    return request.get(`${RulesUri}/${id}/`, { params: params }).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${RulesUri}/`, { params: params }).then(response => {
      return response
    })
  },
  execute(params) {
    return request.post(`${RulesUri}/execute/`, params).then(response => {
      return response
    })
  }
}
