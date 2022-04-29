import request from '@/utils/request'

// token
const TashTokenUri = 'v1/task/token'
export const TaskToken = {
  create() {
    return request.post(`${TashTokenUri}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TashTokenUri}/`, { params: params }).then(response => {
      return response
    })
  }
}

// key
const TaskKeyUri = 'v1/task/keys'
export const TaskKeys = {
  // 同意key
  create(params) {
    return request.post(`${TaskKeyUri}/accept/`, params).then(response => {
      return response
    })
  },
  // 测试 minion
  testpost(params) {
    return request.post(`${TaskKeyUri}/test/`, params).then(response => {
      return response
    })
  },
  // 获取 minion 指纹
  fingerpost(params) {
    return request.post(`${TaskKeyUri}/finger/`, params).then(response => {
      return response
    })
  },
  // 获取key accept 列表
  list(params) {
    return request.get(`${TaskKeyUri}/accept/`, { params: params }).then(response => {
      return response
    })
  },
  // 删除 key
  delkey(params) {
    return request.delete(`${TaskKeyUri}/accept/`, { params: params }).then(response => {
      return response
    })
  },
  // 拒绝 key
  delreject(params) {
    return request.delete(`${TaskKeyUri}/reject/`, { params: params }).then(response => {
      return response
    })
  },
  // 获取拒绝 key 的列表
  listreject(params) {
    return request.get(`${TaskKeyUri}/reject/`, { params: params }).then(response => {
      return response
    })
  },
  // 获取拒绝 key 的列表
  listunaccept(params) {
    return request.get(`${TaskKeyUri}/unaccept/`, { params: params }).then(response => {
      return response
    })
  },
  // 获取 拒绝 key 的列表
  listdeied(params) {
    return request.get(`${TaskKeyUri}/deied/`, { params: params }).then(response => {
      return response
    })
  }
}

// run task
const TaskRunUri = 'v1/task/run'
export const TaskRun = {
  create(params) {
    return request.post(`${TaskRunUri}/`, params).then(response => {
      return response
    })
  }
}

// task history

const TaskHistoryUri = 'v1/task/history'
export const TaskHistory = {
  delete(params) {
    return request.delete(`${TaskHistoryUri}/deldata/`, { params }).then(response => {
      return response
    })
  },
  create(params) {
    return request.post(`${TaskHistoryUri}/`, params).then(response => {
      return response
    })
  },
  delpost(params) {
    return request.post(`${TaskHistoryUri}/deldata/`, params).then(response => {
      return response
    })
  },
  update(id, params) {
    return request.put(`${TaskHistoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TaskHistoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TaskHistoryUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TaskHistoryUri}/`, { params: params }).then(response => {
      return response
    })
  }
}

// scheduler

const TaskSchedulerUri = 'v1/task/scheduler'
export const TaskScheduler = {
  create(params) {
    return request.post(`${TaskSchedulerUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TaskSchedulerUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TaskSchedulerUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TaskSchedulerUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TaskSchedulerUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TaskSchedulerUri}/`, { params: params }).then(response => {
      return response
    })
  },
  pause(id) {
    return request.post(`${TaskSchedulerUri}/${id}/pause/`).then(response => {
      return response
    })
  },
  resume(id) {
    return request.post(`${TaskSchedulerUri}/${id}/resume/`).then(response => {
      return response
    })
  }
}
