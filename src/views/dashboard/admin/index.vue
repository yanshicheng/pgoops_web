<template>
  <div v-if="showVisible" id="omp_iframe_container" :style="divIframeStyle">
    <iframe id="omp_iframe" ref="iframe" :src="monitorUrl" width="100%" :style="iframeStyle()" frameBorder="0" />
  </div>
  <div v-else>
    <span>{{ msg }}</span>
  </div>
</template>

<script>
import { Application as masterApi } from '@/api/monitoring'
export default {
  name: 'AdminDashboard',
  data() {
    return {
      monitorUrl: '',
      showVisible: false,
      msg: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      masterApi.service_monitor().then(res => {
        this.monitorUrl = res.data.url
        this.showVisible = res.data.status
        this.msg   = res.data.msg
      })
    },
    widhtDrawer() {
      const h = document.getElementById('root')
      return `${h.clientWidth + 50}px`
    },
    divIframeStyle() {
      return `overflow: hidden; position: relative; background-color: #f6f7f9;height:300px`
    },
    iframeStyle() {
      const h = document.documentElement.clientHeight
      return `width: 100%;position: "absolute";height:${h}px`
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
::v-deep .el-drawer__close-btn {
  position: fixed;
  border: none;
  margin-right: 12px;
  cursor: pointer;
  font-size: 20px;
  color: inherit;
  background-color: transparent;
}
::v-deep .el-drawer__header > :first-child {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  margin-left: 35px;
}
::v-deep  .el-drawer__header {
  display: flex;
  align-items: center;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 22px;
  line-height: 22px;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
