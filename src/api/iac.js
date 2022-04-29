import request from '@/utils/request'

// token
const RepositoryUri = 'v1/iac/repository'
export const REPOSITORY = {
  create(params) {
    return request.post(`${RepositoryUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${RepositoryUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${RepositoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${RepositoryUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${RepositoryUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${RepositoryUri}/`, { params: params }).then(response => {
      return response
    })
  },
  tar(id) {
    return request.get(`${RepositoryUri}/${id}/download/`).then(response => {
      return response
    })
  },
  download(path) {
    return request.get(`media/iac/iac_download/${path}`).then(response => {
      return response
    })
  },
  mainInfo(id) {
    return request.get(`${RepositoryUri}/${id}/main-info/`).then(response => {
      return response
    })
  }
}

const TaskUri = 'v1/iac/task'
export const Task = {
  create(params) {
    return request.post(`${TaskUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TaskUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TaskUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TaskUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TaskUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TaskUri}/`, { params: params }).then(response => {
      return response
    })
  },
  create_rsync(params) {
    return request.post(`${TaskUri}/sync-task/`, params).then(response => {
      return response
    })
  }
}

const TASKEVENTURI = 'v1/iac/task-event'
export const TaskEvent = {
  create(params) {
    return request.post(`${TASKEVENTURI}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TASKEVENTURI}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TASKEVENTURI}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TASKEVENTURI}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TASKEVENTURI}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TASKEVENTURI}/`, { params: params }).then(response => {
      return response
    })
  }
}

const TaskStatsUri = 'v1/iac/task-stats'
export const TaskStats = {
  create(params) {
    return request.post(`${TaskStatsUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TaskStatsUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TaskStatsUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TaskStatsUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TaskStatsUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TaskStatsUri}/`, { params: params }).then(response => {
      return response
    })
  }
}

const TaskPeriodicUri = 'v1/iac/task-periodic'
export const TaskPeriodic = {
  create(params) {
    return request.post(`${TaskPeriodicUri}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TaskPeriodicUri}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TaskPeriodicUri}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TaskPeriodicUri}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TaskPeriodicUri}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TaskPeriodicUri}/`, { params: params }).then(response => {
      return response
    })
  },
  pause(id) {
    return request.post(`${TaskPeriodicUri}/${id}/pause/`).then(response => {
      return response
    })
  },
  enable(id) {
    return request.post(`${TaskPeriodicUri}/${id}/enable/`).then(response => {
      return response
    })
  }
}
