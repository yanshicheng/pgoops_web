<template>
  <el-card class="box-card">
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane name="1" label="已接受">
        <Accept v-if="activeName=='1'" />
      </el-tab-pane>
      <el-tab-pane label="未接受" name="2">
        <Unaccept v-if="activeName=='2'" />
      </el-tab-pane>
      <el-tab-pane label="已拒绝" name="3">
        <Rejected v-if="activeName=='3'" />
      </el-tab-pane>
      <el-tab-pane label="已删除" name="4">
        <Denied v-if="activeName=='4'" />
      </el-tab-pane>
    </el-tabs>
  </el-card>

</template>

<script>
import Accept from './components/accept.vue'
import Unaccept from './components/unaccepted.vue'
import Rejected from './components/rejected.vue'
import Denied from './components/denied.vue'

export default {
  name: 'Index',
  components: {
    Accept,
    Rejected,
    Unaccept,
    Denied
  },
  data() {
    return {
      menuSize: 'mini',
      loading: false,
      currentNode: {},
      activeName: '1',
      activeTabs: 'info'
    }
  },
  created() {
  },
  methods: {
    handleNodeClick(data) {
      this.activeName = '1'
      this.currentNode = data
    },
    handleContextMenu(data) {
      this.currentNode = data
    },
    handleTabClick(data) {
      this.activeName = data.name
    }
  }
}

</script>

<style scoped>

</style>
