<template>
  <!--    <iframe id="frame"  src=""  width="100%" height="600px"-->
  <!--            frfameborder="0"></iframe>-->
  <!--  </div>-->
  <div v-if="datas" id="omp_iframe_container" :style="divIframeStyle">
    <iframe id="omp_iframe" ref="iframe" :src="src" width="100%" :style="iframeStyle()" frameBorder="0" />
  </div>
</template>

<script>
import { Provider as masterApi } from '@/api/monitoring'

export default {
  name: 'Index',
  data() {
    return {
      src: '',
      isfolw: null,
      flowSrc: 'www.baidu.com',
      datas: false,
      datas1: 'http://127.0.0.1:8000/api/v1/openapi/test/?orgId=1&var-instance=10.211.55.11:9100&var-interval=30m'
    }
  },
  created() {
    this.GetList()
  },
  methods: {
    divIframeStyle() {
      const h = document.documentElement.clientHeight
      return `overflow: hidden; position: relative; background-color: #f6f7f9;height:${h}px`
    },
    iframeStyle() {
      const h = document.documentElement.clientHeight
      return `width: 100%;position: "absolute";height:${h}px`
    },
    GetList() {
      const sss = {
        'var-instance': '10.211.55.11:9100'
      }
      masterApi.create(sss).then(response => {
        // const h = document.getElementsByClassName("root").clientHeight
        // console.log( response.data.url)
        // this.src = response.data.url
        const url = response.data.url
        this.src = response.data.url
        this.datas = true
        this.$refs.iframe.src = require(url)
        // console.log(this.$refs.iframe.contentWindow)
        // this.isfolw = true
        // var url= response.data.url
        // $('#frame').attr('src', url);
        // console.log(response.data)
        this.datas = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
