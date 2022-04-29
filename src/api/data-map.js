import request from '@/utils/request'

// 类型相关
const CMDBClassify = 'v1/data-map/classify'
export const Classify = {
  create(params) {
    return request.post(`${CMDBClassify}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${CMDBClassify}/${id}/`)
  },
  update(id, params) {
    return request.put(`${CMDBClassify}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${CMDBClassify}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${CMDBClassify}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${CMDBClassify}/`, { params: params }).then(response => {
      return response
    })
  },
  tree(params) {
    return request.get(`${CMDBClassify}/tree/`, { params: params }).then(response => {
      return response
    })
  },
  parent() {
    return request.get(`${CMDBClassify}/parent/`).then(response => {
      return response
    })
  },
  bind(params) {
    return request.post(`${CMDBClassify}/bind/`, params).then(response => {
      return response
    })
  },
  un_bind(params) {
    return request.delete(`${CMDBClassify}/un-bind/`, { data: params })
  }
}

const Fields = 'v1/data-map/field'
export const Field = {
  create(params) {
    return request.post(`${Fields}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${Fields}/${id}/`)
  },
  update(id, params) {
    return request.put(`${Fields}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${Fields}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${Fields}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${Fields}/`, { params: params }).then(response => {
      return response
    })
  }
}

const CMDBAsset = 'v1/data-map/asset'
export const CMDBAssets = {
  create(params) {
    return request.post(`${CMDBAsset}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${CMDBAsset}/${id}/`)
  },
  update(id, params) {
    return request.put(`${CMDBAsset}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${CMDBAsset}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${CMDBAsset}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${CMDBAsset}/`, { params: params }).then(response => {
      return response
    })
  },
  search(params) {
    return request.get(`${CMDBAsset}/search/`, { params: params }).then(response => {
      return response
    })
  },
  bind(params) {
    return request.post(`${CMDBAsset}/bind/`, params).then(response => {
      return response
    })
  },
  un_bind(params) {
    return request.delete(`${CMDBAsset}/un-bind/`, { data: params })
  }
}

const CMDBRecord = 'v1/data-map/record'
export const Record = {
  create(params) {
    return request.post(`${CMDBRecord}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${CMDBRecord}/${id}/`)
  },
  update(id, params) {
    return request.put(`${CMDBRecord}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${CMDBRecord}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${CMDBRecord}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${CMDBRecord}/`, { params: params }).then(response => {
      return response
    })
  }
}

// 标签相关 API
const TagUrl = '/data-map/tag'
export const Tag = {
  create(params) {
    return request.post(`${TagUrl}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${TagUrl}/${id}/`)
  },
  update(id, params) {
    return request.put(`${TagUrl}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${TagUrl}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${TagUrl}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${TagUrl}/`, { params: params }).then(response => {
      return response
    })
  }
}

const DeviceCategoryURL = '/data-map/device-category'
export const DeviceCategory = {
  create(params) {
    return request.post(`${DeviceCategoryURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${DeviceCategoryURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${DeviceCategoryURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${DeviceCategoryURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${DeviceCategoryURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${DeviceCategoryURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const IDCURL = '/data-map/idc'
export const Idc = {
  create(params) {
    return request.post(`${IDCURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${IDCURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${IDCURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${IDCURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${IDCURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${IDCURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const USERURL = '/data-map/user'
export const User = {
  create(params) {
    return request.post(`${USERURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${USERURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${USERURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${USERURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${USERURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${USERURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const USERGROUPURL = '/data-map/user-group'
export const UserGroup = {
  create(params) {
    return request.post(`${USERGROUPURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${USERGROUPURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${USERGROUPURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${USERGROUPURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${USERGROUPURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${USERGROUPURL}/`, { params: params }).then(response => {
      return response
    })
  }
}
const ASSETURL = '/data-map/asset'
export const Asset = {
  create(params) {
    return request.post(`${ASSETURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${ASSETURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${ASSETURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${ASSETURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${ASSETURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${ASSETURL}/`, { params: params }).then(response => {
      return response
    })
  },
  task_asset(params) {
    return request.get(`${ASSETURL}/task_asset/`, { params: params }).then(response => {
      return response
    })
  }

}

const SERVER = '/data-map/server'
export const Server = {
  create(params) {
    return request.post(`${SERVER}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${SERVER}/${id}/`)
  },
  update(id, params) {
    return request.put(`${SERVER}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${SERVER}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${SERVER}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${SERVER}/`, { params: params }).then(response => {
      return response
    })
  }
}

const ASSETRECORD = '/data-map/asset-record'
export const AssetRecord = {
  create(params) {
    return request.post(`${ASSETRECORD}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${ASSETRECORD}/${id}/`)
  },
  update(id, params) {
    return request.put(`${ASSETRECORD}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${ASSETRECORD}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${ASSETRECORD}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${ASSETRECORD}/`, { params: params }).then(response => {
      return response
    })
  }
}

const ASSETERRORLOG = '/data-map/asset-errorLog'
export const AssetError = {
  create(params) {
    return request.post(`${ASSETERRORLOG}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${ASSETERRORLOG}/${id}/`)
  },
  update(id, params) {
    return request.put(`${ASSETERRORLOG}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${ASSETERRORLOG}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${ASSETERRORLOG}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${ASSETERRORLOG}/`, { params: params }).then(response => {
      return response
    })
  }
}

const NETWORKURL = '/data-map/server-network'
export const ServerNetwork = {
  create(params) {
    return request.post(`${NETWORKURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${NETWORKURL}/${id}/`).then(response => {
      return response
    })
  },
  update(id, params) {
    return request.put(`${NETWORKURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${NETWORKURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${NETWORKURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${NETWORKURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const MEMORYURL = '/data-map/server-memory'
export const ServerMemory = {
  create(params) {
    return request.post(`${MEMORYURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${MEMORYURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${MEMORYURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${MEMORYURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${MEMORYURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${MEMORYURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const DISKURL = '/data-map/server-disk'
export const ServerDisk = {
  create(params) {
    return request.post(`${DISKURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${DISKURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${DISKURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${DISKURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${DISKURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${DISKURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const NETWORKDEVICEURL = '/data-map/network-device'
export const NetworkDevice = {
  create(params) {
    return request.post(`${NETWORKDEVICEURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${NETWORKDEVICEURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${NETWORKDEVICEURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${NETWORKDEVICEURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${NETWORKDEVICEURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${NETWORKDEVICEURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const BusinessUnitURL = '/data-map/business-unit'
export const BusinessUnit = {
  create(params) {
    return request.post(`${BusinessUnitURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${BusinessUnitURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${BusinessUnitURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${BusinessUnitURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${BusinessUnitURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${BusinessUnitURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const CloudServerURL = '/data-map/cloud-server'
export const CloudServer = {
  create(params) {
    return request.post(`${CloudServerURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${CloudServerURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${CloudServerURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${CloudServerURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${CloudServerURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${CloudServerURL}/`, { params: params }).then(response => {
      return response
    })
  }
}

const CloudDiskURL = '/data-map/cloud-disk'
export const CloudDisk = {
  create(params) {
    return request.post(`${CloudDiskURL}/`, params).then(response => {
      return response
    })
  },
  delete(id) {
    return request.delete(`${CloudDiskURL}/${id}/`)
  },
  update(id, params) {
    return request.put(`${CloudDiskURL}/${id}/`, params).then(response => {
      return response
    })
  },
  patch(id, params) {
    return request.patch(`${CloudDiskURL}/${id}/`, params).then(response => {
      return response
    })
  },
  get(id) {
    return request.get(`${CloudDiskURL}/${id}/`).then(response => {
      return response
    })
  },
  list(params) {
    return request.get(`${CloudDiskURL}/`, { params: params }).then(response => {
      return response
    })
  }
}
